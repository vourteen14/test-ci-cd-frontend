- job_name: 'blackbox'
  metrics_path: /probe
  params:
    module: [http_2xx]
  static_configs:
    - targets:
      - http://heypico-staging.local
      - http://grafana.heypico-staging.local
      - http://prometheus.heypico-staging.local
      - 
  relabel_configs:
    - source_labels: [__address__]
      target_label: __param_target
    - source_labels: [__param_target]
      target_label: instance
    - target_label: __address__
      replacement: prometheus-blackbox-prometheus-blackbox-exporter.monitoring.svc.cluster.local:9115