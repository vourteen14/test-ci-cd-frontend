- job_name: 'blackbox'
  metrics_path: /probe
  params:
    module: [http_2xx]
  static_configs:
    - targets:
      - https://apps2.angga-sr.xyz
      - https://grafana.angga-sr.xyz
      - https://prometheus.angga-sr.xyz
      - 
  relabel_configs:
    - source_labels: [__address__]
      target_label: __param_target
    - source_labels: [__param_target]
      target_label: instance
    - target_label: __address__
      replacement: prometheus-blackbox-prometheus-blackbox-exporter.monitoring.svc.cluster.local:9115