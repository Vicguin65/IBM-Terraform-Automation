variable "ami_id" {
  description = "AMI ID for EC2 instances"
  type        = string
  default     = "ami-03c983f9003cb9cd1"
}

variable "instance_type" {
  description = "Instance type for EC2 instances"
  type        = string
  default     = "t2.micro"
}

variable "user_data_file" {
  description = "Path to the user data script file"
  type        = string
  default     = "react-data-apache.sh"
}

variable "lb_name" {
  description = "Name of the load balancer"
  type        = string
  default     = "web-alb"
}

variable "lb_type" {
  description = "Type of the load balancer"
  type        = string
  default     = "application"
}

variable "tg_name" {
  description = "Name of the target group"
  type        = string
  default     = "web-tg"
}

variable "public_subnets_ids" {
  type = list(string)
}

variable "private_subnets_ids" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}