#!/usr/bin/env bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
K8S_DIR="$SCRIPT_DIR/k8s"

echo "=== 1. Pointing to Minikube Docker Environment ==="
eval $(minikube docker-env)

echo "=== 2. Cleaning Up Existing Application Resources ==="
kubectl delete deployments --all --ignore-not-found
kubectl delete svc -l app --ignore-not-found
kubectl delete configmaps -l app --ignore-not-found
kubectl delete pvc -l app --ignore-not-found

echo "=== 3. Building Microservice Docker Images inside Minikube ==="
docker build -t ricky_capstoneproject_cohort1-cake-catalog:latest "$SCRIPT_DIR/Cake_Catalog_Microservice"
docker build -t ricky_capstoneproject_cohort1-order-service:latest "$SCRIPT_DIR/Order_Microservice"
docker build -t ricky_capstoneproject_cohort1-notification-service:latest "$SCRIPT_DIR/Notification_Microservice"
docker build -t ricky_capstoneproject_cohort1-rating-service:latest "$SCRIPT_DIR/Rating_Microservice"
docker build -t ricky_capstoneproject_cohort1-gateway:latest "$SCRIPT_DIR/cake-delight-gateway"
docker build -t ricky_capstoneproject_cohort1-frontend:latest "$SCRIPT_DIR/cake-delight-frontend"

echo "=== 4. Deploying Cake Delight Microservices to Kubernetes ==="
if [ ! -d "$K8S_DIR" ]; then
  echo "Error: Directory $K8S_DIR not found."
  exit 1
fi

# Apply all manifests
kubectl apply -f "$K8S_DIR/"

echo "=== 5. Waiting for Core Services to Roll Out ==="
kubectl rollout status deployment/mongodb --timeout=120s
kubectl rollout status deployment/rabbitmq --timeout=120s
kubectl rollout status deployment/cake-catalog --timeout=120s
kubectl rollout status deployment/order-service --timeout=120s
kubectl rollout status deployment/notification-service --timeout=120s
kubectl rollout status deployment/rating-service --timeout=120s
kubectl rollout status deployment/gateway --timeout=120s
kubectl rollout status deployment/frontend --timeout=120s

# Determine Minikube/Node IP or default to localhost
NODE_IP=$(minikube ip 2>/dev/null || echo "localhost")
FRONTEND_PORT=$(kubectl get svc frontend -o jsonpath='{.spec.ports[0].nodePort}')
GATEWAY_PORT=$(kubectl get svc gateway -o jsonpath='{.spec.ports[0].nodePort}')

echo ""
echo "=================================================="
echo "   🎉 Cake Delight Deployed Successfully!         "
echo "=================================================="
echo ""
echo "📱 ACCESS URLS:"
echo "--------------------------------------------------"
echo "  • Frontend Web UI:    http://${NODE_IP}:${FRONTEND_PORT}"
echo "  • API Gateway:        http://${NODE_IP}:${GATEWAY_PORT}"
echo "--------------------------------------------------"