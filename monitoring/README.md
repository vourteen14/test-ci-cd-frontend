# Description
Kubernetes YAML and HELM manifest for deploy Grafana, Prometheus, and Kubernetes Dashboard. In this manifest we also deploy blackbox exporter. Also on this, I provided for setting up the Grafana dashboards we use as well as configuring the alerting system to forward alerts to Discord.

- _grafana_dashboard.md
- _alerting_cpu_and_healthcheck.md
- _blackbox_job.md

# Apply Namespace & Ingress Certificae 
kubectl apply -f namespace.yaml
kubectl apply -f wildcard-cert.yaml

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

# Kubernetes Dashboard
kubectl apply -f dashboard-deployment.yaml
kubectl apply -f dashboard-clusterrole.yaml
kubectl apply -f dashboard-certificate.yaml
kubectl apply -f dashboard-ingress.yaml

# Get Login Token Kubernetes Dashboard
kubectl -n kubernetes-dashboard create token admin-user

# Get Configmap Prometheus Server
kubectl get configmap prometheus-server -o yaml -n monitoring > _prometheus-server-configmap.yaml

# Sesuaikan dengen blackbox scrape job
Update config _prometheus-server-configmap.yaml dengan _blackbox_job.md

# Update Configmap Prometheus Server
kubectl apply -f _prometheus-server-configmap.yaml

# Restart Prometheus Server
kubectl -n monitoring delete pod $(kubectl get pod -n monitoring | tr -s ' ' | cut -d ' ' -f 1 | grep prometheus-server)