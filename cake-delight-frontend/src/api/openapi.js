const openapi = {
  openapi: "3.0.3",

  info: {
    title: "Cake Delight API",
    version: "1.0.0",
    description:
      "Interactive API documentation for the Cake Delight cloud-native microservices application."
  },

  servers: [
    {
      url: "http://localhost:3004",
      description: "Express Gateway"
    }
  ],

  tags: [
    {
      name: "Cake Catalog",
      description:
        "Customer and admin APIs for managing cakes."
    },
    {
      name: "Cake Images",
      description:
        "Static cake image resources."
    },
    {
      name: "Basket",
      description:
        "Customer basket management APIs."
    },
    {
      name: "Orders",
      description:
        "Customer checkout and admin order management APIs."
    },
    {
      name: "Ratings & Reviews",
      description:
        "Cake ratings and customer reviews."
    },
    {
      name: "Notifications",
      description:
        "Customer notification APIs."
    }
  ],

  paths: {

    // =========================================================
    // CAKE CATALOG
    // =========================================================

    "/cakes": {

      get: {
        tags: ["Cake Catalog"],
        summary: "Get cakes",
        description:
          "Returns all cakes. Optional query parameters can be used to filter the catalog.",

        parameters: [

          {
            name: "name",
            in: "query",
            required: false,
            description:
              "Filter cakes by name using a case-insensitive search.",
            schema: {
              type: "string",
              example: "forest"
            }
          },

          {
            name: "category",
            in: "query",
            required: false,
            description:
              "Filter cakes by category.",
            schema: {
              type: "string",
              example: "Chocolate"
            }
          },

          {
            name: "minPrice",
            in: "query",
            required: false,
            description:
              "Minimum cake price.",
            schema: {
              type: "number",
              example: 200
            }
          },

          {
            name: "maxPrice",
            in: "query",
            required: false,
            description:
              "Maximum cake price.",
            schema: {
              type: "number",
              example: 500
            }
          },

          {
            name: "availability",
            in: "query",
            required: false,
            description:
              "Filter by cake availability.",
            schema: {
              type: "boolean",
              example: true
            }
          }

        ],

        responses: {

          "200": {
            description:
              "Cakes retrieved successfully."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }
      },


      post: {
        tags: ["Cake Catalog"],
        summary: "Add a new cake",
        description:
          "Creates a new cake and uploads its image.",

        requestBody: {

          required: true,

          content: {

            "multipart/form-data": {

              schema: {

                type: "object",

                required: [
                  "name",
                  "description",
                  "category",
                  "price",
                  "availability",
                  "image"
                ],

                properties: {

                  name: {
                    type: "string",
                    example: "Black Forest Cake"
                  },

                  description: {
                    type: "string",
                    example: "Chocolate cake with cherries."
                  },

                  category: {
                    type: "string",
                    example: "Chocolate"
                  },

                  price: {
                    type: "number",
                    example: 400
                  },

                  availability: {
                    type: "boolean",
                    example: true
                  },

                  image: {
                    type: "string",
                    format: "binary"
                  }

                }

              }

            }

          }

        },

        responses: {

          "201": {
            description:
              "Cake created successfully."
          },

          "400": {
            description:
              "Validation failed."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }
      }

    },


    "/cakes/{id}": {

      get: {

        tags: ["Cake Catalog"],

        summary: "Get cake by ID",

        parameters: [

          {
            name: "id",
            in: "path",
            required: true,

            description:
              "MongoDB ID of the cake.",

            schema: {
              type: "string",
              example: "6a77823e0f81d46bf62e8c46"
            }
          }

        ],

        responses: {

          "200": {
            description:
              "Cake retrieved successfully."
          },

          "404": {
            description:
              "Cake not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      },


      put: {

        tags: ["Cake Catalog"],

        summary: "Update a cake",

        description:
          "Updates cake information. An image can optionally be uploaded to replace the existing image. The old physical image is deleted when replaced.",

        parameters: [

          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a77823e0f81d46bf62e8c46"
            }
          }

        ],

        requestBody: {

          required: true,

          content: {

            "multipart/form-data": {

              schema: {

                type: "object",

                required: [
                  "name",
                  "description",
                  "category",
                  "price",
                  "availability"
                ],

                properties: {

                  name: {
                    type: "string",
                    example: "Updated Black Forest Cake"
                  },

                  description: {
                    type: "string",
                    example: "Updated cake description."
                  },

                  category: {
                    type: "string",
                    example: "Chocolate"
                  },

                  price: {
                    type: "number",
                    example: 450
                  },

                  availability: {
                    type: "boolean",
                    example: true
                  },

                  image: {
                    type: "string",
                    format: "binary",
                    description:
                      "Optional replacement image."
                  }

                }

              }

            }

          }

        },

        responses: {

          "200": {
            description:
              "Cake updated successfully."
          },

          "400": {
            description:
              "Validation failed."
          },

          "404": {
            description:
              "Cake not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      },


      delete: {

        tags: ["Cake Catalog"],

        summary: "Delete a cake",

        parameters: [

          {
            name: "id",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a77823e0f81d46bf62e8c46"
            }
          }

        ],

        responses: {

          "204": {
            description:
              "Cake deleted successfully."
          },

          "404": {
            description:
              "Cake not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    // =========================================================
    // CAKE IMAGES
    // =========================================================

    "/cake-images/{filename}": {

      get: {

        tags: ["Cake Images"],

        summary: "Get a cake image",

        description:
          "Returns a stored cake image.",

        parameters: [

          {
            name: "filename",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "1786285703670-3.png"
            }
          }

        ],

        responses: {

          "200": {
            description:
              "Cake image."
          },

          "404": {
            description:
              "Image not found."
          }

        }

      }

    },


    // =========================================================
    // BASKET
    // =========================================================

    "/baskets": {

      get: {

        tags: ["Basket"],

        summary: "Test basket service",

        description:
          "Returns a simple basket service status response.",

        responses: {

          "200": {
            description:
              "Basket service response."
          }

        }

      }

    },


    "/baskets/items": {

      post: {

        tags: ["Basket"],

        summary: "Add a cake to basket",

        description:
          "Adds a cake to an existing basket or creates a new basket if basketId is not supplied.",

        requestBody: {

          required: true,

          content: {

            "application/json": {

              schema: {

                type: "object",

                required: [
                  "cakeId"
                ],

                properties: {

                  basketId: {
                    type: "string",
                    example: "6a7c793e1dcfcdffa78d2ea2",
                    description:
                      "Existing basket ID. Optional when creating a new basket."
                  },

                  cakeId: {
                    type: "string",
                    example: "6a77823e0f81d46bf62e8c46"
                  },

                  quantity: {
                    type: "integer",
                    minimum: 1,
                    example: 2
                  }

                }

              }

            }

          }

        },

        responses: {

          "200": {
            description:
              "Cake added to basket successfully."
          },

          "400": {
            description:
              "Validation failed or cake unavailable."
          },

          "404": {
            description:
              "Cake not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/baskets/{basketId}": {

      get: {

        tags: ["Basket"],

        summary: "Get basket by ID",

        parameters: [

          {
            name: "basketId",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a7c793e1dcfcdffa78d2ea2"
            }
          }

        ],

        responses: {

          "200": {
            description:
              "Basket retrieved successfully."
          },

          "404": {
            description:
              "Basket not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/baskets/{basketId}/items/{cakeId}": {

      put: {

        tags: ["Basket"],

        summary: "Update basket item quantity",

        parameters: [

          {
            name: "basketId",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a7c793e1dcfcdffa78d2ea2"
            }
          },

          {
            name: "cakeId",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a77823e0f81d46bf62e8c46"
            }
          }

        ],

        requestBody: {

          required: true,

          content: {

            "application/json": {

              schema: {

                type: "object",

                required: [
                  "quantity"
                ],

                properties: {

                  quantity: {
                    type: "integer",
                    minimum: 1,
                    example: 3
                  }

                }

              }

            }

          }

        },

        responses: {

          "200": {
            description:
              "Basket updated successfully."
          },

          "400": {
            description:
              "Quantity validation failed."
          },

          "404": {
            description:
              "Basket or cake not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      },


      delete: {

        tags: ["Basket"],

        summary: "Remove cake from basket",

        parameters: [

          {
            name: "basketId",
            in: "path",
            required: true,

            schema: {
              type: "string"
            }
          },

          {
            name: "cakeId",
            in: "path",
            required: true,

            schema: {
              type: "string"
            }
          }

        ],

        responses: {

          "202": {
            description:
              "Cake removed from basket successfully."
          },

          "404": {
            description:
              "Basket or cake not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    // =========================================================
    // ORDERS
    // =========================================================

    "/orders/checkout": {

      post: {

        tags: ["Orders"],

        summary: "Place an order",

        requestBody: {

          required: true,

          content: {

            "application/json": {

              schema: {

                type: "object",

                required: [
                  "basketId",
                  "customerName",
                  "email",
                  "address",
                  "phone"
                ],

                properties: {

                  basketId: {
                    type: "string",
                    example: "6a7c793e1dcfcdffa78d2ea2"
                  },

                  customerName: {
                    type: "string",
                    example: "Ricky F"
                  },

                  email: {
                    type: "string",
                    format: "email",
                    example: "ricky@example.com"
                  },

                  address: {
                    type: "string",
                    example:
                      "CG04, Katariya Apartments, Kumbalgodu, Kengeri"
                  },

                  phone: {
                    type: "string",
                    example: "7418922390"
                  }

                }

              }

            }

          }

        },

        responses: {

          "200": {
            description:
              "Order placed successfully."
          },

          "400": {
            description:
              "Validation failed or basket is empty."
          },

          "404": {
            description:
              "Basket not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/orders": {

      get: {

        tags: ["Orders"],

        summary: "Get all orders",

        description:
          "Returns all orders. Intended for admin order management.",

        responses: {

          "200": {
            description:
              "Orders retrieved successfully."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/orders/{orderId}": {

      get: {

        tags: ["Orders"],

        summary: "Get order by ID",

        parameters: [

          {
            name: "orderId",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a7c836506888261fc1b0e4c"
            }
          }

        ],

        responses: {

          "200": {
            description:
              "Order retrieved successfully."
          },

          "404": {
            description:
              "Order not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/orders/{orderId}/status": {

      patch: {

        tags: ["Orders"],

        summary: "Update order status",

        description:
          "Admin operation for changing the status of an order. Completing an order publishes an ORDER_COMPLETED event to RabbitMQ.",

        parameters: [

          {
            name: "orderId",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a7caa8a791de496295cdae6"
            }
          }

        ],

        requestBody: {

          required: true,

          content: {

            "application/json": {

              schema: {

                type: "object",

                required: [
                  "status"
                ],

                properties: {

                  status: {

                    type: "string",

                    enum: [
                      "Pending",
                      "Processing",
                      "Completed",
                      "Cancelled"
                    ],

                    example: "Completed"

                  }

                }

              }

            }

          }

        },

        responses: {

          "200": {
            description:
              "Order status updated successfully."
          },

          "400": {
            description:
              "Invalid order status or validation failed."
          },

          "404": {
            description:
              "Order not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    // =========================================================
    // RATINGS
    // =========================================================

    "/ratings": {

      post: {

        tags: ["Ratings & Reviews"],

        summary: "Submit a rating and review",

        requestBody: {

          required: true,

          content: {

            "application/json": {

              schema: {

                type: "object",

                required: [
                  "cakeId",
                  "customerName",
                  "rating"
                ],

                properties: {

                  cakeId: {
                    type: "string",
                    example: "6a77823e0f81d46bf62e8c46"
                  },

                  customerName: {
                    type: "string",
                    example: "Ricky"
                  },

                  rating: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    example: 5
                  },

                  review: {
                    type: "string",
                    example:
                      "The cake was excellent!"
                  }

                }

              }

            }

          }

        },

        responses: {

          "201": {
            description:
              "Rating submitted successfully."
          },

          "400": {
            description:
              "Validation failed."
          },

          "404": {
            description:
              "Cake not found in catalog."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/ratings/cake/{cakeId}": {

      get: {

        tags: ["Ratings & Reviews"],

        summary: "Get all ratings for a cake",

        parameters: [

          {
            name: "cakeId",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a77823e0f81d46bf62e8c46"
            }
          }

        ],

        responses: {

          "200": {
            description:
              "Cake ratings and reviews retrieved successfully."
          },

          "404": {
            description:
              "Cake not found in catalog."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/ratings/cake/{cakeId}/average": {

      get: {

        tags: ["Ratings & Reviews"],

        summary: "Get average rating for a cake",

        parameters: [

          {
            name: "cakeId",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a77823e0f81d46bf62e8c46"
            }
          }

        ],

        responses: {

          "200": {
            description:
              "Average rating retrieved successfully."
          },

          "404": {
            description:
              "Cake not found in catalog."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    // =========================================================
    // NOTIFICATIONS
    // =========================================================

    "/notifications/user/{email}": {

      get: {

        tags: ["Notifications"],

        summary: "Get all customer notifications",

        parameters: [

          {
            name: "email",
            in: "path",
            required: true,

            schema: {
              type: "string",
              format: "email",
              example: "ricky@example.com"
            }
          }

        ],

        responses: {

          "200": {
            description:
              "Notifications retrieved successfully."
          },

          "400": {
            description:
              "Invalid email address."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/notifications/user/{email}/unread": {

      get: {

        tags: ["Notifications"],

        summary: "Get unread customer notifications",

        parameters: [

          {
            name: "email",
            in: "path",
            required: true,

            schema: {
              type: "string",
              format: "email",
              example: "ricky@example.com"
            }

          }

        ],

        responses: {

          "200": {
            description:
              "Unread notifications retrieved successfully."
          },

          "400": {
            description:
              "Invalid email address."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    },


    "/notifications/user/{notificationId}/read": {

      patch: {

        tags: ["Notifications"],

        summary: "Mark notification as read",

        parameters: [

          {
            name: "notificationId",
            in: "path",
            required: true,

            schema: {
              type: "string",
              example: "6a7c8..."
            }

          }

        ],

        responses: {

          "200": {
            description:
              "Notification marked as read."
          },

          "400": {
            description:
              "Invalid notification ID."
          },

          "404": {
            description:
              "Notification not found."
          },

          "500": {
            description:
              "Internal Server Error."
          }

        }

      }

    }

  }

};

export default openapi;