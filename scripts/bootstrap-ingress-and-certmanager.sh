#!/bin/bash
set -e

echo "🚀 Setting up Nginx Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

echo "⏳ Waiting for Nginx Ingress Controller pods to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=Ready pods \
  --selector=app.kubernetes.io/component=controller \
  --timeout=180s

echo "🚀 Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml

echo "⏳ Waiting for cert-manager pods to be ready..."
kubectl wait --namespace cert-manager \
  --for=condition=Ready pods \
  --selector=app.kubernetes.io/instance=cert-manager \
  --timeout=180s

echo "✅ Ingress Controller and cert-manager installed successfully!"
