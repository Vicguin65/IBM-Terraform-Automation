/*
Pprovisions a VPC with both public and private subnets, with all distributed across multiple 
availability zones. Establishes internet gateway for public subnets to enable internet access and a 
NAT gateway for private subnets to allow outbound internet traffic. Additionally, 
necessary route tables and associations are established to manage traffic routing within the VPC.
*/
# Define the main VPC
resource "aws_vpc" "vpc_main" {
  # The CIDR block for the VPC is provided in the variable file
  cidr_block = var.vpc_cidr_block 
  tags = {
    Name = "Terraform VPC - GitHub Actions Demo"
  }
}

# Provision the internet gateway, used to allow connection from VPC to public internet
resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc_main.id
}

# Get the list of available availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Provision the public subnets 
resource "aws_subnet" "public_subnets" {
  count                   = length(var.public_subnet_cidrs)
  # Associate the subnet with the VPC
  vpc_id                  = aws_vpc.vpc_main.id
  # The CIDR block for each subnet is provided in the variable file
  cidr_block              = var.public_subnet_cidrs[count.index] 
  # Each subnet is placed in a different availability zone
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  # Automatically assign a public IP address to instances launched in this subnet
  map_public_ip_on_launch = true
}

# Provision the private subnets
resource "aws_subnet" "private_subnets" {
  count             = length(var.private_subnet_cidrs)
  # Associate the subnet with the VPC
  vpc_id            = aws_vpc.vpc_main.id
  # The CIDR block for each subnet is provided in the variable file
  cidr_block        = var.private_subnet_cidrs[count.index] 
  # Each subnet is placed in a different availability zone
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

# Provision the Elastic IP, required for the NAT gateway
resource "aws_eip" "elastic_ip" {
  domain = "vpc"
  # Ensure the internet gateway is created before this resource
  depends_on = [aws_internet_gateway.internet_gateway]
}

# Provision the NAT gateway, allows instances in a private subnet to connect to services outside the subnet
resource "aws_nat_gateway" "nat" {
  # Use the Elastic IP for the NAT gateway
  allocation_id     = aws_eip.elastic_ip.id
  # Place the NAT gateway in the first public subnet
  subnet_id         = aws_subnet.public_subnets[0].id
  connectivity_type = "public"
  # Ensure the internet gateway is created before this resource
  depends_on = [aws_internet_gateway.internet_gateway]
}

# Configure the default route table for the VPC to route traffic to the internet via the internet gateway
resource "aws_default_route_table" "default_public_route_table" {
  default_route_table_id = aws_vpc.vpc_main.default_route_table_id

  route {
    # Route all outbound traffic (0.0.0.0/0) to the internet gateway
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
}

# Create a custom route table for the private subnets
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.vpc_main.id

  route {
    # Route all outbound traffic (0.0.0.0/0) to the NAT gateway
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}

# Associate each public subnet with the default public route table
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public_subnets)
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_default_route_table.default_public_route_table.id
}

# Associate each private subnet with the custom private route table
resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private_subnets)
  subnet_id      = aws_subnet.private_subnets[count.index].id
  route_table_id = aws_route_table.private.id
}
