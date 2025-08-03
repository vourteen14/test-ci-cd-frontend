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