## I use external vault, i have installed on my machine

### Create vault policy
````
vault policy write heypico-policy - <<EOF
path "secret/data/heypico/*" {
  capabilities = ["read"]
}
EOF
````

### Create token
````
vault token create -policy="heypico-policy" -ttl="720h"
````

### Get the token and put on the `heypico-secret-store.yaml` also change the Vault url, in my case (https://vault.karuhun.cloud)


### Create secret on for backend on Vault
```
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