# Setup data source grafana
- Login to Grafana
- Connection => Data source => Add New Data source

- Add Prometheus
  - Connection URL => http://prometheus-server.monitoring.svc.cluster.local
- Add Loki
  - Connection URL => http://loki-gateway.logging.svc.cluster.local

# Add Grafana dashboard
- Node Exporter
  - Dashboard ID: 1860
- Monitor Pod CPU and Memory usage
  - Dashboard ID: 15055
- Blackbox Exporter
  - Dashboard ID: 7587
- Loki Logs / App
  - Dashboard ID: 13639