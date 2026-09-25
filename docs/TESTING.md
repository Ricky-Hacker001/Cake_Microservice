# Testing and Verification Guide

## 1. Service health checks

Each backend service exposes a simple root route.

```http
GET /
```

Expected responses identify the service.

Examples:

```json
{
  "message": "Welcome to the Cake Catalog Microservice!"
}
```

```json
{
  "message": "Welcome to the Order Microservice!"
}
```

## 2. End-to-end functional flow

### Step 1 — Verify catalog

```http
GET /cakes
```

Confirm cakes are returned.

### Step 2 — Add a cake to a basket

```http
POST /baskets/items
Content-Type: application/json
```

```json
{
  "cakeId": "<valid-cake-id>",
  "quantity": 2
}
```

Save the returned `basketId`.

### Step 3 — Retrieve basket

```http
GET /baskets/<basket-id>
```

Confirm the item and quantity.

### Step 4 — Checkout

```http
POST /orders/checkout
Content-Type: application/json
```

```json
{
  "basketId": "<basket-id>",
  "customerName": "Test Customer",
  "email": "test@example.com",
  "address": "Test address",
  "phone": "9876543210"
}
```

Save the returned `orderId`.

### Step 5 — Retrieve order

```http
GET /orders/<order-id>
```

Confirm status is `Pending`.

### Step 6 — Complete order

```http
PATCH /orders/<order-id>/status
Content-Type: application/json
```

```json
{
  "status": "Completed"
}
```

### Step 7 — Verify notification event

The Order Service should publish:

```text
ORDER_COMPLETED
```

The Notification Service should consume it and create an `Unread` notification.

### Step 8 — Retrieve notifications

```http
GET /notifications/user/test@example.com
```

Confirm the notification exists.

### Step 9 — Mark notification as read

```http
PATCH /notifications/user/<notification-id>/read
```

Confirm the notification status becomes `Read`.

## 3. Rating flow

Submit:

```http
POST /ratings
Content-Type: application/json
```

```json
{
  "cakeId": "<valid-cake-id>",
  "customerName": "Test Customer",
  "rating": 5,
  "review": "Excellent cake"
}
```

Then verify:

```http
GET /ratings/cake/<cake-id>
```

and:

```http
GET /ratings/cake/<cake-id>/average
```

## 4. Validation tests

Verify invalid requests are rejected.

Examples:

- Empty cake name
- Negative cake price
- Invalid availability value
- Invalid MongoDB ID
- Basket quantity less than 1
- Invalid email
- Invalid Indian phone number
- Invalid order status
- Rating below 1
- Rating above 5
- Review longer than 500 characters

## 5. Infrastructure checks

Docker Compose:

```bash
docker compose ps
docker compose logs <service>
```

Kubernetes:

```bash
kubectl get pods
kubectl get svc
kubectl get pvc
kubectl get hpa
```

RabbitMQ:

- Verify the `order_completed_queue` exists.
- Complete an order.
- Confirm the message is consumed.
- Confirm a notification document is created.

## 6. Acceptance checklist

- [ ] Frontend loads successfully.
- [ ] Gateway routes all public API paths.
- [ ] Cakes can be listed and filtered.
- [ ] Admin can add/update/delete cakes.
- [ ] Cake images are uploaded and served.
- [ ] Basket creation and updates work.
- [ ] Checkout creates an order.
- [ ] Basket is removed after checkout.
- [ ] Admin can update order status.
- [ ] `ORDER_COMPLETED` is published.
- [ ] Notification is created asynchronously.
- [ ] Notifications can be marked as read.
- [ ] Ratings can be submitted.
- [ ] Average ratings are calculated.
- [ ] Docker Compose deployment works.
- [ ] Kubernetes deployment works.
- [ ] HPA resources are present.
