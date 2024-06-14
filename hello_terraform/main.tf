provider "aws"{
    //externalized
    access_key = ""
    secret_key = ""
    region = "us-west-1"
}
resource "aws_instance" "hello"{
    ami = "ami-0f66240e199159416"
    instance_type = "t2.micro"
    tags = {
        Name = "hello_terraform"
    }
}

//masking all the keys
//input 
//output

