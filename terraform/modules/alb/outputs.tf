output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.web_alb.dns_name
}

# output "cognito_user_pool_id" {
#   description = "The ID of the Cognito User Pool"
#   value       = aws_cognito_user_pool.pool.id
# }

# output "cognito_client_id" {
#   description = "The ID of the Cognito User Pool Client"
#   value       = aws_cognito_user_pool_client.client.id
# }
