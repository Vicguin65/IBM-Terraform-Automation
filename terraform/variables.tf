variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-west-2"
}

variable "vpc_cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_public_one_cidr" {
  description = "CIDR block for the first public subnet"
  type        = string
  default     = "10.0.3.0/24"
}

variable "subnet_public_two_cidr" {
  description = "CIDR block for the second public subnet"
  type        = string
  default     = "10.0.4.0/24"
}

variable "subnet_private_one_cidr" {
  description = "CIDR block for the first private subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "subnet_private_two_cidr" {
  description = "CIDR block for the second private subnet"
  type        = string
  default     = "10.0.2.0/24"
}

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
