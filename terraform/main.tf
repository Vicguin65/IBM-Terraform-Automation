provider "aws"{
    access_key = ""
    secret_key = ""
    region = "us-west-1"
}
resource "aws_instance" "hello_terraform_instance"{
    ami = "ami-0f66240e199159416"
    instance_type = "t2.micro"
    tags = {
        Name = "hello_world_terraform"
    }
}

