# Dscription
Kubernetes YAML and HELM manifest for deploy Loki and Promtail. Loki for store cerntralize logs and promtail for collect the log from nodes and forwards them to Loki. 

# Apply Namespace
kubectl apply -f namespace.yaml

# Initialize Required Helm Chart
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Loki & Promtail
helm upgrade loki --install --namespace logging -f loki-values.yaml --version "5.47.1" grafana/loki
helm upgrade promtail --install --namespace logging -f promtail-values.yaml --version "6.15.5" grafana/promtail