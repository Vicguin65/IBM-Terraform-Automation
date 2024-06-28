provider "aws"{
    access_key = ""
    secret_key = ""
    region = "us-west-2"
}
resource "aws_instance" "hello_terraform_instance"{
    ami = "ami-0f66240e199159416"
    instance_type = "t2.micro"
    user_data = "${file("user-data-apache.sh")}"

    depends_on = [aws_internet_gateway.internet_gateway]

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

resource "aws_default_route_table" "our_default_route_table" {
  default_route_table_id = aws_vpc.vpc_main.default_route_table_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
}

# resource "aws_route" "r1" {
#   route_table_id            = aws_route_table.route_table.id
#   destination_cidr_block    = "0.0.0.0/0"
# }

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow http inbound traffic and all outbound traffic"
  vpc_id      = aws_vpc.vpc_main.id
}

resource "aws_subnet" "subnet_one" {
  vpc_id     = aws_vpc.vpc_main.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-west-2a"  
  map_public_ip_on_launch = true

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
