/*
This module creates an Application Load Balancer (ALB) for the VPC, along with a 
security group that permits inbound HTTP (port 80) and HTTPS (port 443) traffic, and all outbound 
traffic. It deploys two EC2 instances across 2 private subnets, and configures an ALB to route
 HTTP traffic to the EC2 instances. Additionally, it sets up a Cognito User Pool for authentication, along 
 with a user pool domain and confidential client for OAuth, and adds a listener rule for user authentication via Cognito, 
 forwarding traffic to the target group.
*/
# Define a security group that allows HTTP and HTTPS inbound traffic, and all outbound traffic
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

# Define EC2 instances for the web application, distributed across private subnets
resource "aws_instance" "web_app_instance" {
  count = length(var.private_subnets_ids)

  ami           = var.ami_id        # Use the specified AMI ID
  instance_type = var.instance_type # Use the specified instance type
  user_data     = file(var.user_data_file) # Use the specified user data file for initialization

  vpc_security_group_ids = [aws_security_group.allow_http.id]
  subnet_id              = var.private_subnets_ids[count.index]
}

# Define an Application Load Balancer (ALB) to distribute traffic
resource "aws_lb" "web_alb" {
  name               = var.lb_name # Use the specified load balancer name
  load_balancer_type = var.lb_type # Use the specified load balancer type
  security_groups    = [aws_security_group.allow_http.id]

  subnet_mapping {
    subnet_id = var.public_subnets_ids[0]
  }

  subnet_mapping {
    subnet_id = var.public_subnets_ids[1]
  }
}

# Define a target group for the ALB
resource "aws_lb_target_group" "web_tg" {
  name     = var.tg_name # Use the specified target group name
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

# Attach EC2 instances to the target group
resource "aws_lb_target_group_attachment" "attachment_instance_one" {
  count = length(aws_instance.web_app_instance)

  target_group_arn = aws_lb_target_group.web_tg.arn
  target_id        = aws_instance.web_app_instance[count.index].id
  port             = 80
}

# Define an HTTPS listener for the ALB
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

# Define an HTTP listener for the ALB that redirects to HTTPS
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

# Define a Cognito User Pool
resource "aws_cognito_user_pool" "pool" {
  name                       = var.user_pool_name
  mfa_configuration          = var.mfa_configuration
  sms_authentication_message = var.verification_sms_message

  # Verification configuration
  verification_message_template {
    default_email_option = var.verification_default_email_option
    email_message        = var.verification_email_message
    email_subject        = var.verification_email_subject
    sms_message          = var.verification_sms_message
  }

  # Enable verification of email attribute
  auto_verified_attributes = ["email"]

  # Configure password policy
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  # Specify username attributes
  username_attributes = ["email"]

  # Allow only administrators to create users (optional)
  admin_create_user_config {
    allow_admin_create_user_only = false
  }
}

# Define a Cognito User Pool Domain
resource "aws_cognito_user_pool_domain" "domain" {
  domain       = var.domain_name
  user_pool_id = aws_cognito_user_pool.pool.id
}

# Define a Cognito User Pool Client
resource "aws_cognito_user_pool_client" "client" {
  name            = var.client_name
  user_pool_id    = aws_cognito_user_pool.pool.id
  generate_secret = true 

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

# Define a listener rule to authenticate with Cognito and forward traffic to the target group
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
