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
### BEFORE APPLY CHANGE THE TOKEN, USERNAME
kubectl apply -f repository.yaml

## Install ArgoCD Application
kubectl apply -f application.yaml