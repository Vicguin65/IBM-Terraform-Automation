# TODO
# ADD SECRETS INSTEAD OF HARDCODE
# This task is related to just setting up variables in general
provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

module "network" {
  source = "./modules/network"
}

module "alb" {
  source = "./modules/alb"
  public_subnets_ids = module.network.public_subnet_ids
  private_subnets_ids = module.network.private_subnet_ids
  vpc_id = module.network.vpc_id

  depends_on = [ module.network ]
}
