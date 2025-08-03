#!/bin/bash
set -e
SSL_DIR="./ssl"
mkdir -p $SSL_DIR
DOMAINS=("heypico-staging.local" "dev.heypico.local")
COUNTRY="ID"
STATE="West Java"
CITY="Sumedang"
ORG="HeyPico"
OU="Angga Suriana"
EMAIL="anggasuriana@heypico.local"
COMMON_NAME="${DOMAINS[0]}"
openssl genrsa -out $SSL_DIR/heypico.key 4096
chmod 600 $SSL_DIR/heypico.key
openssl req -new -key $SSL_DIR/heypico.key -out $SSL_DIR/heypico.csr \
  -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORG/OU=$OU/CN=$COMMON_NAME/emailAddress=$EMAIL"
cat > $SSL_DIR/heypico.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
EOF
i=1
for domain in "${DOMAINS[@]}"; do
  echo "DNS.$i = $domain" >> $SSL_DIR/heypico.ext
  ((i++))
done
openssl x509 -req -in $SSL_DIR/heypico.csr -signkey $SSL_DIR/heypico.key \
  -out $SSL_DIR/heypico.crt -days 825 -extfile $SSL_DIR/heypico.ext