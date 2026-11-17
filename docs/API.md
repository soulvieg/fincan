# API

The Express server mounts its routers under `/api` in `backend/server.js`:

```js
app.use("/api/users",      userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products",   productRoutes);
app.use("/api/cart",       cartRoutes);
app.use("/api/products",   reviewRoutes);
app.use("/api/orders",     orderRoutes);
```

Authentication uses a JWT plus an `express-session` cookie. Requests that need a session must be
sent with credentials enabled (`withCredentials: true` in axios).

## Users — `/api/users`

| Method | Path           | Description                     |
| ------ | -------------- | ------------------------------- |
| POST   | `/signup`      | register a customer             |
| POST   | `/login`       | log in, returns a token         |
| GET    | `/me`          | current authenticated user      |
| GET    | `/:id/profile` | read a profile                  |
| PUT    | `/:id/profile` | update a profile                |

## Categories — `/api/categories`

| Method | Path | Description       |
| ------ | ---- | ----------------- |
| GET    | `/`  | list categories   |
| POST   | `/`  | create a category |

## Products — `/api/products`

| Method | Path                            | Description                          |
| ------ | ------------------------------- | ------------------------------------ |
| GET    | `/`                             | catalogue (filtering and sorting)    |
| GET    | `/search`                       | search products                      |
| POST   | `/`                             | create a product                     |
| DELETE | `/:productId`                   | delete a product                     |
| PUT    | `/:productId/quantity`          | set stock                            |
| PATCH  | `/:productId/increment`         | increase stock                       |
| PATCH  | `/:productId/decrement`         | decrease stock                       |
| PATCH  | `/:productId/price`             | set price                            |
| PATCH  | `/:productId/discount`          | apply a discount                     |
| PATCH  | `/:productId/image`             | set the image URL                    |
| POST   | `/categories`                   | attach a category to a product       |
| PUT    | `/comments/:commentId/approve`  | approve a customer comment           |
| PUT    | `/comments/:commentId/reject`   | reject a customer comment            |

## Reviews and ratings — also `/api/products`

`reviewRoutes.js` is mounted on the same base path.

| Method | Path                             | Description                        |
| ------ | -------------------------------- | ---------------------------------- |
| POST   | `/:productId/comment`            | add a comment                      |
| POST   | `/:productId/rating`             | rate a product                     |
| PATCH  | `/comments/:commentId/review`    | update a review                    |
| GET    | `/:productId/comments`           | approved comments for a product    |
| GET    | `/:productId/comments/pending`   | comments awaiting moderation       |
| GET    | `/comments/pending`              | all pending comments               |
| GET    | `/comments/all`                  | all comments                       |
| GET    | `/:productID/:customerID/rating` | a customer's rating for a product  |

## Cart — `/api/cart`

| Method | Path     | Description                              |
| ------ | -------- | ---------------------------------------- |
| GET    | `/`      | current cart                             |
| POST   | `/`      | add an item to the cart                  |
| POST   | `/merge` | merge a guest cart after login           |

## Orders — `/api/orders`

| Method | Path                        | Description                    |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/`                         | list orders                    |
| POST   | `/`                         | create an order (checkout)     |
| PATCH  | `/:orderId/status`          | update the order status        |
| PATCH  | `/:orderId/cancel`          | cancel an order                |
| PATCH  | `/:orderId/mark-delivered`  | mark as delivered              |
| PATCH  | `/:orderId/refund-request`  | request a refund               |
| PATCH  | `/:orderId/refund-status`   | approve or reject a refund     |

## Not mounted yet

These route modules exist in `backend/routes/` but are not wired into `server.js` on this branch:

- `adminRoutes.js` — `POST /signup`, `POST /login`, `GET /salesReport`
- `overseeingAdminAuthRoutes.js` — `POST /login`
- `overseeingAdminRoutes.js` — `POST /promote-user`, `POST /promote-admin`, `POST /demote-admin`,
  `PUT /change-role`, `GET /admins`, `GET /users`, `GET /`, `POST /demote`, `GET /search`
- `wishlistRoutes.js` — `POST /`, `DELETE /`, `GET /:customerId`
