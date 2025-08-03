# HeyPico DevOps Engineer Test

DevOps implementation showcasing containerized web application deployment on Kubernetes with infrastructure as code, CI/CD pipelines, monitoring, and security practices

## Tech Stack

### Infrastructure

- **Terraform** - AWS infrastructure provisioning (VPC, EKS, security groups)
- **Kubernetes (EKS)** - Container orchestration
- **Helm** - Kubernetes package management
- **ArgoCD** - GitOps continuous deployment + Argo CD Static Tag Image Updater
- **NGINX** - Reverse proxy and load balancing

### Application Stack

- **Backend** - Node.js/Express with PostgreSQL
- **Frontend** - Vue.js with Bootstrap
- **Database** - PostgreSQL
- **Containerization** - Docker with multi-stage builds

### Monitoring & Observability

- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization and dashboards
- **Loki** - Log aggregation
- **Promtail** - Log collection agent
- **Blackbox Exporter** - External monitoring and health checks

### Security & Secrets

- **HashiCorp Vault** - Secret management
- **External Secrets Operator** - Kubernetes secret injection
- **SSL/TLS** - Custom certificate management

### CI/CD Pipeline

- **GitHub Actions** - Automated build and push
- **DockerHub** - Container registry
- **ArgoCD** - Automated deployment
- **ArgoCD Image Updater** - Automated pull static image

## Structure

```
├── web-application/        # Application source code
│   ├── backend/            # Node.js API with PostgreSQL
│   └── frontend/           # Vue.js web interface
├── infrastructure/         # Terraform AWS infrastructure
├── helm-charts/            # Application Helm charts
├── monitoring/             # Prometheus & Grafana setup
├── logging/                # Loki & Promtail configuration
├── argocd/                 # GitOps deployment manifests
├── vault-secret/           # External secrets configuration
├── nginx/                  # Reverse proxy configuration
└── ssl/                    # SSL certificate files
```

## Start Guide

### Prerequisites

- AWS CLI configured
- Terraform >= 1.0
- kubectl configured
- Helm >= 3.0
- Docker

### 1. Infra Setup

Deploy AWS infrastructure with Terraform

```bash
cd infrastructure/
terraform init
terraform plan
terraform apply
```

This creates

- VPC with public/private subnets
- EKS cluster with node groups
- Security groups and IAM roles
- ECR repositories

### 2. Kubernetes Cluster Access

Configure kubectl for EKS

```bash
aws eks update-kubeconfig --region us-east-1 --name your-cluster-name
kubectl get nodes
```

### 3. SSL Certificate Generation

Generate self-signed certificates

```bash
./generate-ssl.sh
```

### 4. Deploy Core Services

Install monitoring stack

```bash
cd monitoring/

# Apply Namespace & Ingress Certificae 
kubectl apply -f namespace.yaml

# Create ssl certificate for ingress
kubectl create secret tls heypico-cert --cert=../ssl/heypico.crt --key=../ssl/heypico.key -n monitoring

# Initialize Required Helm Chart
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus
helm upgrade prometheus --install --namespace monitoring -f prometheus-values.yaml --version "27.13.0" prometheus-community/prometheus

# Install Blackbox Exporter
helm upgrade prometheus-blackbox --install --namespace monitoring prometheus-community/prometheus-blackbox-exporter

# Install Grafana
helm upgrade grafana --install --namespace monitoring -f grafana-values.yaml --version "9.0.0" grafana/grafana

# Get Configmap Prometheus Server
kubectl get configmap prometheus-server -o yaml -n monitoring > _prometheus-server-configmap.yaml

# Sesuaikan dengen blackbox scrape job
Update config _prometheus-server-configmap.yaml dengan _blackbox_job.md

# Update Configmap Prometheus Server
kubectl apply -f _prometheus-server-configmap.yaml

# Restart Prometheus Server
kubectl -n monitoring delete pod $(kubectl get pod -n monitoring | tr -s ' ' | cut -d ' ' -f 1 | grep prometheus-server)
```

Install logging stack

```bash
cd logging/
# Apply Namespace
kubectl apply -f namespace.yaml

# Initialize Required Helm Chart
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Loki & Promtail
helm upgrade loki --install --namespace logging -f loki-values.yaml --version "5.47.1" grafana/loki
helm upgrade promtail --install --namespace logging -f promtail-values.yaml --version "6.15.5" grafana/promtail
```

### 5. Setup ArgoCD

Deploy ArgoCD for GitOps

```bash
cd argocd/
# Apply Namespace
kubectl apply -f namespace.yaml

# Create ssl certificate for ingress
kubectl create secret tls heypico-cert --cert=../ssl/heypico.crt --key=../ssl/heypico.key -n argocd

## Install ArgoCD
kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml -n argocd

## Install ArgoCD Image Updater
kubectl apply -f https://raw.githubusercontent.com/argoproj-labs/argocd-image-updater/master/manifests/install.yaml -n argocd

## Install Ingress For ArgoCD UI
kubectl apply -f ingress.yaml

## Install ArgoCD Repisotry
### BEFORE APPLY CHANGE THE TOKEN, USERNAME on repository.yaml
kubectl apply -f repository.yaml

## Install ArgoCD Application
kubectl apply -f application.yaml
```

Get initial admin password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### 6. Setup External Secrets

If using HashiCorp Vault

```bash
cd vault-secret/

# I use external vault, i have installed on my machine
# Create vault policy
vault policy write heypico-policy - <<EOF
path "secret/data/heypico/*" {
  capabilities = ["read"]
}
EOF

### Create token
vault token create -policy="heypico-policy" -ttl="720h"

# Get the token and put on the `heypico-secret-store.yaml` also change the Vault url, in my case (https://vault.karuhun.cloud)
# Create secret on for backend on Vault
vault kv put secret/heypico-backend \
  data='{
    "DB_HOST": "postgres-postgresql.heypico.svc.cluster.local",
    "DB_NAME": "backend",
    "DB_PASSWORD": "ceDYyuedcd1re",
    "DB_PORT": "5432",
    "DB_USER": "heypico",
    "HOST": "0.0.0.0",
    "NODE_ENV": "production",
    "PORT": "3000"
  }'
```

### 7. Deploy Application

Deploy via ArgoCD

```bash
cd argocd/
kubectl apply -f application.yaml
```

Or deploy directly with Helm

```bash
cd helm-charts/
helm upgrade heypico --install --namespace default -f values.yaml .
```

### 8. Local Development

Run application locally with Docker Compose:

```bash
# Set environment variables
export VUE_APP_API_URL=http://localhost:3000

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

## CI/CD Pipeline

The GitHub Actions workflows automatically:

1. **Build Phase**: Install dependencies and run tests
2. **Test Phase**: Execute unit tests with coverage
3. **Build & Push**: Create Docker images and push to registry
4. **Deploy**: ArgoCD automatically syncs and deploys changes

Workflows trigger on pushes to `staging` branch in `web-application/` directories.

## Monitoring & Alerting

### Grafana Dashboards

- **Node Exporter** (ID: 1860) - Server metrics
- **Pod Monitoring** (ID: 15055) - Kubernetes workload metrics
- **Blackbox Exporter** (ID: 7587) - External service monitoring
- **Loki Logs** (ID: 13639) - Application logs

### Alerting Rules

- CPU usage > 70% on application pods
- Service health check failures
- High memory utilization

Alerts are sent to Discord webhooks configured in Grafana.

## Access Points

After deployment, access services via

- **Application**: `https://heypico-staging.local`
- **Grafana**: `https://grafana.heypico-staging.local`
- **Prometheus**: `https://prometheus.heypico-staging.local`
- **ArgoCD**: `https://argocd.heypico-staging.local`

Add these to your `/etc/hosts` file pointing to your ingress controller IP.

## Application Features

- **User Management**: Create, read, update, delete users
- **Responsive UI**: Bootstrap-styled Vue.js interface
- **API Integration**: RESTful backend with PostgreSQL
- **Health Checks**: Built-in monitoring endpoints
- **Container Ready**: Multi-stage Docker builds

## Security Considerations

- All secrets managed via Kubernetes secrets or external secret operator
- Network policies restrict pod-to-pod communication
- SSL/TLS termination at ingress level
- RBAC configured for service accounts
- Container images scanned for vulnerabilities
