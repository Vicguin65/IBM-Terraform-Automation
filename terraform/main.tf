provider "aws"{
    access_key = ""
    secret_key = ""
    region = "us-west-2"
}

resource "aws_vpc" "vpc_main" {

  cidr_block = "10.0.0.0/16"
  tags={
    Name="terraform created VPC"
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

resource "aws_subnet" "subnet_public" {
  vpc_id     = aws_vpc.vpc_main.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "us-west-2c"
}

resource "aws_subnet" "subnet_one" {
  vpc_id     = aws_vpc.vpc_main.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-west-2a"  
}

resource "aws_subnet" "subnet_two" {
  vpc_id     = aws_vpc.vpc_main.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "us-west-2b"
}

resource "aws_instance" "hello_terraform_instance"{
    ami = "ami-03c983f9003cb9cd1"
    instance_type = "t2.micro"
    user_data = "${file("user-data-apache.sh")}"
    
    vpc_security_group_ids = [aws_security_group.allow_http.id]
    subnet_id = aws_subnet.subnet_public.id
}

resource "aws_instance" "instance_one"{
    ami = "ami-03c983f9003cb9cd1"
    instance_type = "t2.micro"
    
    vpc_security_group_ids = [aws_security_group.allow_http.id]
    subnet_id = aws_subnet.subnet_one.id

    tags = {
      Name = "private one"
    }
}

resource "aws_instance" "instance_two"{
    ami = "ami-03c983f9003cb9cd1"
    instance_type = "t2.micro"
    
    vpc_security_group_ids = [aws_security_group.allow_http.id]
    subnet_id = aws_subnet.subnet_two.id
    
    tags = {
      Name = "private two"
    }
}

resource "aws_eip" "nat" {
  domain   = "vpc"

  depends_on = [aws_internet_gateway.internet_gateway]
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.subnet_public.id

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
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.subnet_public.id
  route_table_id = aws_default_route_table.default_public_route_table.id
}

resource "aws_route_table_association" "private_one" {
  subnet_id      = aws_subnet.subnet_one.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_two" {
  subnet_id      = aws_subnet.subnet_two.id
  route_table_id = aws_route_table.private.id
}

