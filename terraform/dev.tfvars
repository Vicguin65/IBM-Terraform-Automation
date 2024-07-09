
aws_region     = "us-west-2"

vpc_cidr_block         = "10.0.0.0/16"
subnet_public_one_cidr = "10.0.3.0/24"
subnet_public_two_cidr = "10.0.4.0/24"
subnet_private_one_cidr = "10.0.1.0/24"
subnet_private_two_cidr = "10.0.2.0/24"

ami_id        = "ami-03c983f9003cb9cd1"
instance_type = "t2.micro"
user_data_file = "user-data-apache.sh"

lb_name = "web-alb"
lb_type = "application"
tg_name = "web-tg"
