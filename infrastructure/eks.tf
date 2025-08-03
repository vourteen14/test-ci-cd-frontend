resource "aws_eks_cluster" "main" {
  name     = "${var.project_name}-cluster"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids              = concat(aws_subnet.public[*].id, aws_subnet.private[*].id)
    endpoint_private_access = false
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_subnet.public,
    aws_subnet.private
  ]

  tags = {
    Name = "${var.project_name}-cluster"
  }

  timeouts {
    create = "30m"
    update = "20m"
    delete = "20m"
  }
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.project_name}-nodes"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.public[*].id

  instance_types = var.node_instance_types
  capacity_type  = "ON_DEMAND"
  disk_size      = 40

  scaling_config {
    desired_size = 1
    max_size     = var.node_max_size
    min_size     = var.node_min_size
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_eks_cluster.main
  ]

  tags = {
    Name = "${var.project_name}-nodes"
  }

  timeouts {
    create = "30m"
    update = "20m"
    delete = "20m"
  }
}