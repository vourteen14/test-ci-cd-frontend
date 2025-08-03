output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_security_group_id" {
  description = "EKS cluster security group ID"
  value       = aws_security_group.eks_cluster.id
}

output "nodes_security_group_id" {
  description = "EKS nodes security group ID"
  value       = aws_security_group.eks_nodes.id
}

output "dockerhub_images" {
  description = "DockerHub images for deployment"
  value = {
    backend  = "vourteen14/heypico-backend:staging"
    frontend = "vourteen14/heypico-frontend:staging"
  }
}

output "kubectl_config_command" {
  description = "Command to configure kubectl"
  value       = "aws --endpoint-url=http://localhost:4566 eks update-kubeconfig --region ${var.region} --name ${aws_eks_cluster.main.name}"
}