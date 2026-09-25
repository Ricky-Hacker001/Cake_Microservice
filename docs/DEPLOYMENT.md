# Deployment Guide

## 1. Prerequisites

Install:

- Docker
- Docker Compose
- kubectl
- Minikube

Verify:

```bash
docker --version
docker compose version
kubectl version --client
minikube version
```

## 2. Docker Compose deployment

From the project root:

```bash
docker compose up --build
```

Verify containers:

```bash
docker compose ps
```

Application URLs:

```text
Frontend:       http://localhost:5173
Gateway:        http://localhost:3004
RabbitMQ UI:    http://localhost:15672
```

Stop:

```bash
docker compose down
```

## 3. Minikube deployment

Start Minikube:

```bash
minikube start
```

Run the provided deployment script:

```bash
chmod +x deploy-k8s.sh
./deploy-k8s.sh
```

The script builds images in Minikube's Docker environment, applies all Kubernetes manifests and waits for the deployments.

## 4. Kubernetes resources

The `k8s/` directory contains:

| Manifest | Purpose |
|---|---|
| `mongodb.yaml` | MongoDB PVC, Deployment and Service |
| `rabbitmq.yaml` | RabbitMQ PVC, Deployment and Service |
| `cake-catalog.yaml` | Cake Catalog Deployment and Service |
| `order-service.yaml` | Order Deployment and Service |
| `notification-service.yaml` | Notification Deployment and Service |
| `rating-service.yaml` | Rating Deployment and Service |
| `gateway.yaml` | Gateway Deployment and NodePort Services |
| `frontend.yaml` | Frontend Deployment and NodePort Service |
| `hpa.yaml` | Horizontal Pod Autoscalers |

## 5. Verify Kubernetes

```bash
kubectl get pods
kubectl get deployments
kubectl get svc
kubectl get pvc
kubectl get hpa
```

Check rollout:

```bash
kubectl rollout status deployment/cake-catalog
kubectl rollout status deployment/order-service
kubectl rollout status deployment/notification-service
kubectl rollout status deployment/rating-service
kubectl rollout status deployment/gateway
kubectl rollout status deployment/frontend
```

## 6. Access the application

Get Minikube IP:

```bash
minikube ip
```

Frontend:

```text
http://<MINIKUBE_IP>:30080
```

API Gateway:

```text
http://<MINIKUBE_IP>:31958
```

## 7. Debugging

List logs:

```bash
kubectl logs deployment/cake-catalog
kubectl logs deployment/order-service
kubectl logs deployment/notification-service
kubectl logs deployment/rating-service
kubectl logs deployment/gateway
kubectl logs deployment/frontend
```

Describe a pod:

```bash
kubectl describe pod <pod-name>
```

Check services:

```bash
kubectl get svc
```

Check endpoints:

```bash
kubectl get endpoints
```

## 8. Cleanup

Remove application resources:

```bash
kubectl delete -f k8s/
```

Stop Minikube:

```bash
minikube stop
```

Delete the cluster when no longer needed:

```bash
minikube delete
```

## 9. Configuration notes

The current deployment is intended for development/capstone use. Production deployment should move credentials and other secrets into Kubernetes Secrets and avoid hard-coded development credentials.
