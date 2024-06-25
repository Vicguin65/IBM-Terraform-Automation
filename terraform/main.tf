provider "aws"{
    access_key = ""
    secret_key = ""
    region = "us-west-2"
}

resource "aws_instance" "instance_one"{
    ami = "ami-0cf2b4e024cdb6960"
    instance_type = "t2.micro"
    user_data = "${file("user-data-apache.sh")}"

    network_interface {
      network_interface_id = aws_network_interface.first_interface.id
      device_index         = 0
  }
}

resource "aws_instance" "instance_two"{
    ami = "ami-0cf2b4e024cdb6960"
    instance_type = "t2.micro"
    
    network_interface {
      network_interface_id = aws_network_interface.second_interface.id
      device_index         = 0
  }
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

resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.vpc_main.id
}

resource "aws_eip" "one" {
  domain                    = "vpc"
  network_interface         = aws_network_interface.first_interface.id
}

resource "aws_nat_gateway" "example" {
  subnet_id     = aws_subnet.subnet_one.id
  allocation_id = aws_eip.one.id

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_internet_gateway.internet_gateway]
}

resource "aws_route" "r1" {
  route_table_id            = aws_route_table.route_table.id
  destination_cidr_block    = "0.0.0.0/0"
  nat_gateway_id = aws_nat_gateway.example.id
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow http inbound traffic and all outbound traffic"
  vpc_id      = aws_vpc.vpc_main.id
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.allow_http.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
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

resource "aws_subnet" "subnet_three" {
  vpc_id     = aws_vpc.vpc_main.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "us-west-2c"
}

resource "aws_network_interface" "first_interface" {
  subnet_id   = aws_subnet.subnet_one.id
  security_groups = [aws_security_group.allow_http.id]
}

resource "aws_network_interface" "second_interface" {
  subnet_id   = aws_subnet.subnet_two.id
  security_groups = [aws_security_group.allow_http.id]
}