# Database Schema

## 1. Database architecture

The application uses MongoDB with separate logical databases for each backend responsibility.

```text
MongoDB
├── catalog_db
│   └── cakes
├── order_microservice
│   ├── baskets
│   └── orders
├── rating_db
│   └── ratings
└── notification_db
    └── notifications
```

This separation keeps each microservice responsible for its own persistent data.

## 2. Cake Catalog

### Database

```text
catalog_db
```

### Collection

```text
cakes
```

### Document

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Cake identifier |
| `name` | String | Yes | Cake name |
| `description` | String | Yes | Cake description |
| `category` | String | Yes | Cake category |
| `price` | Number | Yes | Cake price |
| `availability` | Boolean | Yes | Whether the cake can be ordered |
| `imageUrl` | String | Yes | Gateway-accessible image path |

Example:

```json
{
  "_id": "ObjectId(...)",
  "name": "Black Forest Cake",
  "description": "Chocolate cake with cherries.",
  "category": "Chocolate",
  "price": 400,
  "availability": true,
  "imageUrl": "/cake-images/example.png"
}
```

## 3. Order Service — Basket

### Database

```text
order_microservice
```

### Collection

```text
baskets
```

### Document

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Basket identifier |
| `items` | Array | Yes | Items currently in basket |
| `items.cakeId` | String | Yes | Catalog cake ID |
| `items.name` | String | Yes | Snapshot of cake name |
| `items.price` | Number | Yes | Snapshot of cake price |
| `items.quantity` | Number | Yes | Quantity, minimum 1 |
| `items.imageUrl` | String | Yes | Snapshot of image path |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

The basket stores product information as a snapshot rather than using MongoDB population or a cross-database reference.

## 4. Order Service — Order

### Collection

```text
orders
```

### Document

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Order identifier |
| `customerName` | String | Yes | Customer name |
| `email` | String | Yes | Customer email |
| `phone` | String | Yes | Customer phone |
| `address` | String | Yes | Delivery address |
| `items` | Array | Yes | Ordered item snapshots |
| `items.cakeId` | String | Yes | Cake catalog ID |
| `items.name` | String | Yes | Cake name at order time |
| `items.price` | Number | Yes | Cake price at order time |
| `items.quantity` | Number | Yes | Ordered quantity |
| `items.imageUrl` | String | Yes | Image path |
| `totalPrice` | Number | Yes | Calculated order total |
| `status` | String | Yes | Order lifecycle state |

Allowed order status:

```text
Pending
Processing
Completed
Cancelled
```

The order does not use a database-level foreign key to the cake catalog. Cake information is copied into the order item at checkout.

## 5. Rating Service

### Database

```text
rating_db
```

### Collection

```text
ratings
```

### Document

| Field | Type | Required | Rules |
|---|---|---|---|
| `_id` | ObjectId | Auto | Rating identifier |
| `cakeId` | String | Yes | Catalog cake ID |
| `customerName` | String | Yes | Reviewer name |
| `rating` | Number | Yes | Integer from 1 to 5 |
| `review` | String | No | Maximum 500 characters |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

## 6. Notification Service

### Database

```text
notification_db
```

### Collection

```text
notifications
```

### Document

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Notification identifier |
| `orderId` | String | Yes | Completed order ID |
| `customerName` | String | Yes | Customer name |
| `email` | String | Yes | Customer email |
| `message` | String | Yes | Notification content |
| `status` | String | Yes | Read state |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

Allowed notification status:

```text
Unread
Read
```

## 7. Data ownership

| Data | Owner |
|---|---|
| Cakes | Cake Catalog Service |
| Basket | Order Service |
| Orders | Order Service |
| Ratings | Rating Service |
| Notifications | Notification Service |

Services communicate through APIs/events rather than directly accessing another service's MongoDB collection.
