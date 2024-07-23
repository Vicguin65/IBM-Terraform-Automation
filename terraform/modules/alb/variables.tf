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
  default     = "./modules/alb/react-data-apache.sh"
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
  description = "List of public subnet ids"
  type        = list(string)
}

variable "private_subnets_ids" {
  description = "List of private subnet ids"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID for network"
  type        = string
}

variable "ssl_certificate_arn" {
  description = "ARN of SSL Certificate"
  type        = string
  default     = "arn:aws:acm:us-west-2:416469482962:certificate/ca2f258f-31ee-470a-bfdb-e3ed7fba7def"
}

variable "domain_name" {
  description = "Domain name of Cognito Domain"
  type        = string
  default     = "rcos-cloud-authentication2024"
}

variable "client_name" {
  description = "Name of Cognito Client"
  type        = string
  default     = "my-client"
}

variable "user_pool_name" {
  description = "Name of user pool"
  type        = string
  default     = "my_pool"
}

# Verification Message Template Variables
variable "verification_default_email_option" {
  description = "The default email option for verification."
  type        = string
  default     = "CONFIRM_WITH_CODE"
}

variable "verification_email_message" {
  description = "The email message for verification."
  type        = string
  default     = "Your verification code is {####}."
}

variable "verification_email_subject" {
  description = "The subject of the email verification message."
  type        = string
  default     = "Your verification code"
}

variable "verification_sms_message" {
  description = "The SMS message for verification."
  type        = string
  default     = "Your verification code is {####}."
}





