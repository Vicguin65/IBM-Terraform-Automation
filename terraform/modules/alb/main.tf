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
  port     = 443
  protocol = "HTTPS"
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

resource "aws_lb_listener" "web_listener" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "redirect"

    redirect {
      status_code = "HTTP_301"
      protocol = "HTTPS"
      port = 443
    }
  }
}

resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-west-2:416469482962:certificate/ca2f258f-31ee-470a-bfdb-e3ed7fba7def"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}
