# tfstate files are stored on S3 buckets
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.58.0"
    }
  }

  # backend specifies where the state files are stored
  backend "s3" {
    bucket = "rcos-terraform"
    key    = "state/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
    
    # this table specifies where a lock is created to prevent a race condition
    dynamodb_table = "terraform_tf_lockid"
  }
}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

module "network" {
  source = "./modules/network"
}

module "alb" {
  source              = "./modules/alb"
  public_subnets_ids  = module.network.public_subnet_ids
  private_subnets_ids = module.network.private_subnet_ids
  vpc_id              = module.network.vpc_id

  depends_on = [module.network]
}
