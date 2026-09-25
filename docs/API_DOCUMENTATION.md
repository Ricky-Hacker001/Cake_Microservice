# Cake Delight API Documentation

## 1. Overview

The public API is exposed through the Express Gateway.

```text
Base URL: http://<MINIKUBE_IP>:31958
```
```text
API Doc URL: http://<MINIKUBE_IP>:30080/api-docs
```

The gateway routes requests to the following services:

| Prefix | Service |
|---|---|
| `/cakes` | Cake Catalog |
| `/cake-images` | Cake Catalog static images |
| `/baskets` | Order Service |
| `/orders` | Order Service |
| `/ratings` | Rating Service |
| `/notifications` | Notification Service |

All JSON request bodies use:

```http
Content-Type: application/json
```

Cake creation/update uses:

```http
Content-Type: multipart/form-data
```

## 2. Cake Catalog API

### GET `/cakes`

Returns cakes. Optional filters are supported.

Query parameters:

| Parameter | Type | Description |
|---|---|---|
| `name` | string | Case-insensitive name search |
| `category` | string | Case-insensitive category search |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `availability` | boolean | Filter by availability |

Example:

```http
GET /cakes?category=Chocolate&minPrice=200&maxPrice=600&availability=true
```

### POST `/cakes`

Creates a cake.

Request: `multipart/form-data`

| Field | Required | Type |
|---|---|---|
| `name` | Yes | string |
| `description` | Yes | string |
| `category` | Yes | string |
| `price` | Yes | number > 0 |
| `availability` | Yes | boolean |
| `image` | Yes | binary file |

Example response:

```json
{
  "_id": "665f...",
  "name": "Black Forest Cake",
  "description": "Chocolate cake with cherries.",
  "category": "Chocolate",
  "price": 400,
  "availability": true,
  "imageUrl": "/cake-images/example.png"
}
```

Status codes:

- `201` — Created
- `400` — Validation error
- `500` — Internal server error

### GET `/cakes/{id}`

Returns a cake by MongoDB ID.

- `200` — Cake returned
- `404` — Cake not found
- `500` — Internal server error

### PUT `/cakes/{id}`

Updates cake information. An image can optionally replace the existing image.

Required form fields:

- `name`
- `description`
- `category`
- `price`
- `availability`

Optional:

- `image`

### DELETE `/cakes/{id}`

Deletes a cake.

- `204` — Deleted
- `404` — Cake not found
- `500` — Internal server error

### GET `/cake-images/{filename}`

Returns a stored cake image.

## 3. Basket API

### GET `/baskets`

Returns the basket route/service status response.

### POST `/baskets/items`

Adds a cake to a basket. If `basketId` is not supplied or the basket does not exist, a new basket is created.

Request:

```json
{
  "basketId": "665f...",
  "cakeId": "665e...",
  "quantity": 2
}
```

`basketId` is optional. `cakeId` is required and `quantity` defaults to `1`.

The Order Service synchronously calls the Cake Catalog Service to verify the cake and its availability.

Responses:

- `200` — Added successfully
- `400` — Invalid request or unavailable cake
- `404` — Cake not found
- `500` — Internal server error

### GET `/baskets/{basketId}`

Returns a basket.

### PUT `/baskets/{basketId}/items/{cakeId}`

Updates the quantity of a cake.

Request:

```json
{
  "quantity": 3
}
```

- `200` — Updated
- `400` — Invalid quantity
- `404` — Basket or cake item not found
- `500` — Internal server error

### DELETE `/baskets/{basketId}/items/{cakeId}`

Removes a cake from a basket.

- `202` — Removed
- `404` — Basket or cake item not found
- `500` — Internal server error

## 4. Order API

### POST `/orders/checkout`

Creates an order from a basket.

Request:

```json
{
  "basketId": "665f...",
  "customerName": "Customer Name",
  "email": "customer@example.com",
  "address": "Customer address",
  "phone": "9876543210"
}
```

The total is calculated from the basket items:

```text
totalPrice = Σ(item.price × item.quantity)
```

The basket is deleted after the order is saved.

Responses:

- `200` — Order created
- `400` — Validation error or empty basket
- `404` — Basket not found
- `500` — Internal server error

### GET `/orders`

Returns all orders. Intended for administration.

### GET `/orders/{orderId}`

Returns one order.

### PATCH `/orders/{orderId}/status`

Updates order status.

Request:

```json
{
  "status": "Completed"
}
```

Allowed values:

```text
Pending
Processing
Completed
Cancelled
```

When status changes to `Completed`, an `ORDER_COMPLETED` event is published to RabbitMQ.

## 5. Rating API

### POST `/ratings`

Creates a rating/review.

Request:

```json
{
  "cakeId": "665e...",
  "customerName": "Ricky",
  "rating": 5,
  "review": "The cake was excellent!"
}
```

Validation:

- `cakeId` required
- `customerName` required
- `rating` integer from 1 to 5
- `review` optional, maximum 500 characters

The Rating Service synchronously verifies that the cake exists in the Cake Catalog Service.

### GET `/ratings/cake/{cakeId}`

Returns all ratings for a cake, newest first.

Example response:

```json
{
  "cakeId": "665e...",
  "totalRatings": 2,
  "ratings": [
    {
      "_id": "6660...",
      "cakeId": "665e...",
      "customerName": "Ricky",
      "rating": 5,
      "review": "Excellent!",
      "createdAt": "2026-08-13T00:00:00.000Z",
      "updatedAt": "2026-08-13T00:00:00.000Z"
    }
  ]
}
```

### GET `/ratings/cake/{cakeId}/average`

Returns the average rating and count.

Example:

```json
{
  "cakeId": "665e...",
  "averageRating": 4.5,
  "totalRatings": 10
}
```

If there are no ratings:

```json
{
  "cakeId": "665e...",
  "averageRating": 0,
  "totalRatings": 0
}
```

## 6. Notification API

### GET `/notifications/user/{email}`

Returns all notifications for an email address, newest first.

### GET `/notifications/user/{email}/unread`

Returns only unread notifications.

### PATCH `/notifications/user/{notificationId}/read`

Marks a notification as read.

Example response:

```json
{
  "message": "Notification marker as read",
  "notification": {
    "_id": "6660...",
    "orderId": "665f...",
    "customerName": "Customer Name",
    "email": "customer@example.com",
    "message": "Hello Customer Name, your order 665f... has been completed successfully. Total amount: 800",
    "status": "Read"
  }
}
```

## 7. Common error format

Most validation/business errors follow:

```json
{
  "message": "Description of the error"
}
```

Validation middleware may return an `errors` array containing individual validation failures.

## 8. Service-level internal ports

These ports are used inside Docker Compose/Kubernetes and should generally not be called directly by the browser:

```text
Cake Catalog       3000
Order Service      3001
Notification       3002
Rating Service     3003
Gateway HTTP       3004
Gateway Admin      9876
RabbitMQ AMQP      5672
RabbitMQ Admin     15672
MongoDB             27017
```

The frontend should use the gateway URL rather than directly accessing individual microservices.
