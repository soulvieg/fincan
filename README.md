# Fincan

Fincan is a full-stack e-commerce platform for a coffee and tea store: a React storefront for
customers and a back-office area for the staff. It was built as the term project of a Software
Development course, by a student team, following an Agile process with Jira.

The stack is React 19 + TypeScript on the frontend, Node.js + Express + Sequelize on the backend,
MySQL 8 for storage, and Docker Compose to run everything locally.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [API](#api)
- [Tests](#tests)
- [Development process](#development-process)
- [Documentation](#documentation)
- [Team](#team)
- [Known limitations](#known-limitations)

## Features

**Customers**

- Browse the catalogue by category, with search and sorting
- Product detail page with ratings and comments
- Wishlist and shopping cart
- Checkout and order history, with downloadable invoices (PDF)
- Refund requests on delivered orders
- Profile settings (personal data, password)
- Signup and login with JWT + server-side session

**Staff**

- Product management: create products, update stock, change prices, apply discounts,
  upload images, moderate customer comments
- Sales management and promotions (`sales`) at service level
- Admin accounts with three roles: `productManager`, `salesManager`, `overseeingAdmin`

> The customer flows and the product-management area are fully wired to the API. The sales,
> user-management and admin-login screens are present as UI prototypes on this branch — see
> [Known limitations](#known-limitations).

## Tech stack

| Layer      | Technologies                                                                                |
| ---------- | ------------------------------------------------------------------------------------------- |
| Frontend   | React 19, TypeScript, React Router 7, webpack 5, MUI 6, Bootstrap 5, axios, react-icons, html2pdf.js |
| Backend    | Node.js 20, Express 4, Sequelize 6, mysql2, JWT, express-session, bcryptjs                   |
| Database   | MySQL 8 (schema, seeds and a stored procedure in `database/`)                                |
| Infra      | Docker Compose, nginx (frontend image), phpMyAdmin                                           |
| Tests      | Jest (backend service and controller tests)                                                  |

## Project structure

```
fincan/
├── backend/                  # Express REST API
│   ├── config/db.js          # Sequelize connection
│   ├── controllers/          # request handlers
│   ├── middlewares/          # auth and role guards
│   ├── models/               # Sequelize models + associations
│   ├── routes/               # route definitions, mounted under /api/*
│   ├── services/             # business logic
│   ├── _tests_/              # Jest tests
│   ├── server.js             # app entry point
│   └── Dockerfile
├── frontend/                 # React + TypeScript single-page app
│   ├── src/components/       # reusable UI components
│   ├── src/contexts/         # Cart, Order, Product, Review, User, Wishlist contexts
│   ├── src/pages/            # route-level pages (storefront and back office)
│   ├── src/styles/           # CSS
│   ├── webpack.config.js
│   └── Dockerfile            # multi-stage build, served by nginx
├── database/
│   ├── schema.sql            # tables
│   ├── seed_customers.sql    # customer seed data
│   ├── seed.sql              # catalogue seed data
│   └── procedure.sql         # stored procedures
├── docs/                     # setup and API documentation
├── docker-compose.yml        # frontend, backend, MySQL and phpMyAdmin
├── seeding.sh                # reload the database from the SQL files
├── src/, public/             # legacy Create React App scaffold (superseded by frontend/)
└── package.json              # legacy CRA package file
```

## Getting started

### Requirements

- Docker and Docker Compose (recommended), or
- Node.js 20 and MySQL 8 for running the services outside containers

### With Docker

```bash
git clone git@github.com:soulvieg/fincan.git
cd fincan
docker compose up --build
```

The database is initialised on first start from the SQL files in `database/`, in this order:
`schema.sql`, `seed_customers.sql`, `seed.sql`, `procedure.sql`.

| Service    | URL                     | Credentials     |
| ---------- | ----------------------- | --------------- |
| Frontend   | http://localhost        | —               |
| Backend    | http://localhost:5001   | —               |
| phpMyAdmin | http://localhost:8080   | `root` / `password` |
| MySQL      | `localhost:3307`        | `root` / `password`, database `fincan` |

To reload the schema and the seed data without rebuilding the containers:

```bash
./seeding.sh
```

### Without Docker

Backend:

```bash
cd backend
cp .env.example .env        # then set DB_PASSWORD, JWT_SECRET, SESSION_SECRET
# running outside Docker, use DB_HOST=localhost and the mapped MySQL port
npm install
npm start
```

Frontend (dev server on http://localhost:3000):

```bash
cd frontend
npm install
npm start
```

The API base URL is currently hardcoded to `http://localhost:5001` in the frontend contexts, so the
app expects the backend on that port. See [Known limitations](#known-limitations).

## Environment variables

`backend/.env` (copy from `backend/.env.example`):

| Variable         | Description                                        |
| ---------------- | -------------------------------------------------- |
| `PORT`           | Port the Express server listens on (default `5000`) |
| `NODE_ENV`       | `development` or `production`                       |
| `DB_HOST`        | MySQL host (`db` inside Docker, `localhost` outside) |
| `DB_NAME`        | Database name (`fincan`)                            |
| `DB_USER`        | MySQL user                                          |
| `DB_PASSWORD`    | MySQL password                                      |
| `JWT_SECRET`     | Secret used to sign JWTs                            |
| `SESSION_SECRET` | Secret used by express-session (startup fails if unset) |

Inside Docker Compose these values are provided by `docker-compose.yml`, so no `.env` file is needed.
Real `.env` files and `cookies.txt` are intentionally not versioned.

## Database

The schema covers users, admins, products, categories, carts, cart items, orders, refunds, cards,
wishlists, ratings and comments. Sequelize models live in `backend/models/` and are synchronised at
startup with `sequelize.sync()`; `database/schema.sql` is the reference DDL used to initialise the
container.

## API

All routes are mounted under `/api` by `backend/server.js`:

| Base path         | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `/api/users`      | signup, login, profile, current user                 |
| `/api/products`   | catalogue, search, stock, prices, discounts, images, comments and ratings |
| `/api/categories` | list and create categories                           |
| `/api/cart`       | cart items, cart merge                               |
| `/api/orders`     | create orders, list, status changes, cancel, refunds |
| `/api/wishlist`   | wishlist (route module present, not mounted yet)     |

See [docs/API.md](docs/API.md) for the endpoint list.

## Tests

Backend tests live in `backend/_tests_/` and cover the cart, product and review services and
controllers with Jest mocks:

```bash
cd backend
npx jest
```

The Jest runner is not declared in `backend/package.json` yet, so `npx` downloads it on first run.

## Development process

The project was developed with **Agile** methodologies, organised in sprints. **Jira** was used as
the supporting tool: the product backlog, sprint backlogs, user stories and bug tickets were tracked
there, and the work was split into feature branches merged through GitHub pull requests after
review. The branch names in the repository (`feature/product_page`, `feature/refund_api`,
`shoppingcart-fix`, `bug-fixes`, `edi_sprint3`, ...) reflect that workflow.

## Documentation

- [docs/SETUP.md](docs/SETUP.md) — detailed setup, ports and troubleshooting
- [docs/API.md](docs/API.md) — endpoints, grouped by route module

## Team

Built during the course by, in alphabetical order of GitHub handle:

- [Ahmet Nusret Avcı](https://github.com/nusret)
- [Can Çağlar](https://github.com/HCanCaglar)
- [Chronomortis](https://github.com/Chronomortis)
- [Edoardo Carpena](https://github.com/soulvieg)
- [Egi Çekici](https://github.com/egi-c)
- [Lyana Al Havasli](https://github.com/lyanalhavasli)
- [Mehmet Berkay Çatak](https://github.com/xylocroft)
- [Neda Mohamed](https://github.com/neda-ibr)

This repository is a copy of the original course project, published for portfolio purposes:
[neda-ibr/fincan](https://github.com/neda-ibr/fincan).

## Known limitations

- The API base URL is hardcoded to `http://localhost:5001` in the frontend contexts, and
  `frontend/src/services.js` (which reads `REACT_APP_API_BASE_URL`) is currently unused. The app only
  works when the backend is reachable at that address on the same machine.
- The admin login, admin signup, sales-management and user-management pages are UI prototypes and do
  not call the API yet; `backend/routes/adminRoutes.js`, `overseeingAdminRoutes.js` and
  `wishlistRoutes.js` exist but are not mounted in `server.js`.
- Database credentials and a JWT secret are hardcoded in `docker-compose.yml` for local development
  only; they must be replaced before any real deployment.
- The database is hit with `sequelize.sync()` at startup instead of migrations.
- The root `src/`, `public/` and `package.json` are the original Create React App scaffold, kept for
  history and superseded by `frontend/`.
