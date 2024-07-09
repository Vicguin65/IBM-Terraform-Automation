# TODO
# ADD SECRETS INSTEAD OF HARDCODE
# This task is related to just setting up variables in general
provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

resource "aws_vpc" "vpc_main" {

  cidr_block = var.vpc_cidr_block #variable file
  tags = {
    Name = "terraform created VPC"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc_main.id
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow http/https inbound traffic and all outbound traffic"
  vpc_id      = aws_vpc.vpc_main.id

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

resource "aws_subnet" "subnet_public_one" {
  vpc_id                  = aws_vpc.vpc_main.id
  cidr_block              = var.subnet_public_one_cidr #variable file
  availability_zone       = "us-west-2a" #allow terraform to pickup zone automatically
  map_public_ip_on_launch = true
}

resource "aws_subnet" "subnet_public_two" {
  vpc_id                  = aws_vpc.vpc_main.id
  cidr_block              = var.subnet_public_two_cidr #variable file
  availability_zone       = "us-west-2b" #allow terraform to pickup zone automatically
  map_public_ip_on_launch = true
}

resource "aws_subnet" "subnet_private_one" {
  vpc_id            = aws_vpc.vpc_main.id
  cidr_block        = var.subnet_private_one_cidr #variable file
  availability_zone = "us-west-2a" #allow terraform to pickup zone automatically
}

resource "aws_subnet" "subnet_private_two" {
  vpc_id            = aws_vpc.vpc_main.id
  cidr_block        = var.subnet_private_two_cidr #variable file
  availability_zone = "us-west-2b" #allow terraform to pickup zone automatically
}

# TODO
# BRAINSTORM BETTER DESIGN FOR THE DEPENDS_ON

resource "aws_instance" "instance_one" {
  ami           = var.ami_id #variable file 
  instance_type = var.instance_type #variable file//check with hazel if can run hazels application
  user_data     = file(var.user_data_file)

  vpc_security_group_ids = [aws_security_group.allow_http.id]
  subnet_id              = aws_subnet.subnet_private_one.id

  depends_on = [ aws_internet_gateway.internet_gateway, aws_nat_gateway.nat, aws_route_table.private, aws_default_route_table.default_public_route_table, aws_route_table_association.private_one, aws_route_table_association.private_two, aws_route_table_association.public_one, aws_route_table_association.public_two  ]
}

resource "aws_instance" "instance_two" {
  ami           = var.ami_id
  instance_type = var.instance_type
  user_data     = file(var.user_data_file) #variable file

  vpc_security_group_ids = [aws_security_group.allow_http.id]
  subnet_id              = aws_subnet.subnet_private_two.id

  depends_on = [ aws_internet_gateway.internet_gateway, aws_nat_gateway.nat, aws_route_table.private, aws_default_route_table.default_public_route_table, aws_route_table_association.private_one, aws_route_table_association.private_two, aws_route_table_association.public_one, aws_route_table_association.public_two  ]
}

resource "aws_eip" "elastic_ip" {
  domain = "vpc"

  depends_on = [aws_internet_gateway.internet_gateway]

}

resource "aws_nat_gateway" "nat" {
  allocation_id     = aws_eip.elastic_ip.id
  subnet_id         = aws_subnet.subnet_public_one.id
  connectivity_type = "public"

  depends_on = [aws_internet_gateway.internet_gateway]
}

resource "aws_default_route_table" "default_public_route_table" {
  default_route_table_id = aws_vpc.vpc_main.default_route_table_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.vpc_main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}

resource "aws_route_table_association" "public_one" {
  subnet_id      = aws_subnet.subnet_public_one.id
  route_table_id = aws_default_route_table.default_public_route_table.id
}

resource "aws_route_table_association" "public_two" {
  subnet_id      = aws_subnet.subnet_public_two.id
  route_table_id = aws_default_route_table.default_public_route_table.id
}

resource "aws_route_table_association" "private_one" {
  subnet_id      = aws_subnet.subnet_private_one.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_two" {
  subnet_id      = aws_subnet.subnet_private_two.id
  route_table_id = aws_route_table.private.id
}

resource "aws_lb" "web_alb" {
  name               = var.lb_name #variable file
  load_balancer_type = var.lb_type #variable file
  security_groups    = [aws_security_group.allow_http.id]

  subnet_mapping {
    subnet_id = aws_subnet.subnet_public_one.id
  }

  subnet_mapping {
    subnet_id = aws_subnet.subnet_public_two.id
  }
}

resource "aws_lb_target_group" "web_tg" {
  name     = var.tg_name #variable file
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc_main.id

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
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}

resource "aws_cognito_user_pool" "userpool" {
  name = "mu-userpool"

  schema {
    name                     = "Email"
    attribute_data_type      = "String"
    mutable                  = true
    developer_only_attribute = false
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length = 6
  }

  username_attributes = ["email"]

  username_configuration {
    case_sensitive = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name                 = "user_pool_client"
  user_pool_id         = aws_cognito_user_pool.userpool.id
  explicit_auth_flows  = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  generate_secret       = false
  refresh_token_validity = 1
  access_token_validity  = 1
  id_token_validity      = 1
  token_validity_units {
    access_token = "hours"
    id_token     = "hours"
    refresh_token = "hours"
  }
}
