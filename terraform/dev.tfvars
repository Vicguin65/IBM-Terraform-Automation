
aws_region = "us-west-2"

ami_id         = "ami-03c983f9003cb9cd1"
instance_type  = "t2.micro"
user_data_file = "user-data-apache.sh"

lb_name = "web-alb"
lb_type = "application"
tg_name = "web-tg"
