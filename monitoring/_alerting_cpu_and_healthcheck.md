
# Setup Discord Webhook
- Create a new text channel for alert notification,
- Server Settings => Intergration => Webhooks => New Webhook
- Change the destination channel => Save settings
- Hit copy webhook url for copying the webhook url

# Setup Grafana 
- Login to Grafana
- Go to Alerting => Contact points => New contact point
- On Integeration choose Discord and paste the webhook url on webhook url field

# Alerting PromQL for getting CPU pod cpu usage
(
  max by (container, pod) (
    rate(container_cpu_usage_seconds_total{pod=~"flask-.*", container="devops"}[5m])
  )
  /
  max by (container, pod) (
    kube_pod_container_resource_limits{pod=~"flask-.*", container="devops", resource="cpu"}
  )
  * 100
) > bool 70

# Alerting PromQL for getting health check web
probe_success{instance=~"http://apps\\.angga-sr\\.xyz/status"}
probe_success{instance=~"http://grafana\\.angga-sr\\.xyz/status"}
probe_success{instance=~"http://prometheus\\.angga-sr\\.xyz/status"}