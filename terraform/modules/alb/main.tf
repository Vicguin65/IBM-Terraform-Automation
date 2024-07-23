resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow http/https inbound traffic and all outbound traffic"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "instance_one" {
  ami           = var.ami_id        #variable file 
  instance_type = var.instance_type #variable file//check with hazel if can run hazels application
  user_data     = file(var.user_data_file)

  vpc_security_group_ids = [aws_security_group.allow_http.id]
  subnet_id              = var.private_subnets_ids[0]
}


resource "aws_instance" "instance_two" {
  ami           = var.ami_id
  instance_type = var.instance_type
  user_data     = file(var.user_data_file) #variable file

  vpc_security_group_ids = [aws_security_group.allow_http.id]
  subnet_id              = var.private_subnets_ids[1]
}

resource "aws_lb" "web_alb" {
  name               = var.lb_name #variable file
  load_balancer_type = var.lb_type #variable file
  security_groups    = [aws_security_group.allow_http.id]

  subnet_mapping {
    subnet_id = var.public_subnets_ids[0]
  }

  subnet_mapping {
    subnet_id = var.public_subnets_ids[1]
  }
}

resource "aws_lb_target_group" "web_tg" {
  name     = var.tg_name #variable file
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-299"
  }
}

resource "aws_lb_target_group_attachment" "attachment_instance_one" {
  target_group_arn = aws_lb_target_group.web_tg.arn
  target_id        = aws_instance.instance_one.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "attachment_instance_two" {
  target_group_arn = aws_lb_target_group.web_tg.arn
  target_id        = aws_instance.instance_two.id
  port             = 80
}

resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      status_code = "HTTP_301"
      protocol    = "HTTPS"
      port        = 443
    }
  }
}


resource "aws_cognito_user_pool" "pool" {
  name                       = var.user_pool_name
  mfa_configuration          = "OFF"
  sms_authentication_message = var.verification_sms_message

  # Verification
  verification_message_template {
    default_email_option = var.verification_default_email_option
    email_message        = var.verification_email_message
    email_subject        = var.verification_email_subject
    sms_message          = var.verification_sms_message
  }

  # Enable verification 
  auto_verified_attributes = ["email"]

  # Configure password policy
  password_policy {
    minimum_length                   = 6
    require_lowercase                = false
    require_numbers                  = false
    require_symbols                  = false
    require_uppercase                = false
    temporary_password_validity_days = 7
  }

  # Specify username attributes
  username_attributes = ["email"]

  # Allow only administrators to create users (optional)
  admin_create_user_config {
    allow_admin_create_user_only = false
  }
}



resource "aws_cognito_user_pool_domain" "domain" {
  domain       = var.domain_name
  user_pool_id = aws_cognito_user_pool.pool.id
}


resource "aws_cognito_user_pool_client" "client" {
  name            = var.client_name
  user_pool_id    = aws_cognito_user_pool.pool.id
  generate_secret = true # This makes it a confidential client

  # Valid explicit auth flows for OAuth
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "openid",
    "profile",
    "email",
    "phone",
    "aws.cognito.signin.user.admin"
  ]
  callback_urls = ["https://${aws_lb.web_alb.dns_name}/oauth2/idpresponse"]

  access_token_validity        = 2
  id_token_validity            = 2
  refresh_token_validity       = 24
  supported_identity_providers = ["COGNITO"]
}


resource "aws_lb_listener_rule" "cognito-authentication" {
  listener_arn = aws_lb_listener.https_listener.arn

  action {
    type = "authenticate-cognito"

    authenticate_cognito {
      user_pool_arn       = aws_cognito_user_pool.pool.arn
      user_pool_client_id = aws_cognito_user_pool_client.client.id
      user_pool_domain    = aws_cognito_user_pool_domain.domain.domain
    }
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}