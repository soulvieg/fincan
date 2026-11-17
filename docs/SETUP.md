# Setup

Two ways to run Fincan: Docker Compose (recommended) or Node.js locally.

## Requirements

- Docker Engine 24+ with Docker Compose v2
- or Node.js 20 + npm, and a MySQL 8 instance

## Run with Docker Compose

```bash
git clone git@github.com:soulvieg/fincan.git
cd fincan
docker compose up --build
```

The compose file defines four services:

| Service      | Container port | Host port | Notes                                                    |
| ------------ | -------------- | --------- | -------------------------------------------------------- |
| `frontend`   | 80             | 80        | multi-stage build, served by nginx                        |
| `backend`    | 5000           | 5001      | waits for MySQL to accept connections (`wait-for-it.sh`)   |
| `db`         | 3306           | 3307      | MySQL 8, data in the `mysql_data` volume                  |
| `phpmyadmin` | 80             | 8080      | `root` / `password`                                        |

Open http://localhost for the app, http://localhost:5001 for the API, http://localhost:8080 for
phpMyAdmin.

On the first start the MySQL image executes, in order:

1. `database/schema.sql`
2. `database/seed_customers.sql`
3. `database/seed.sql`
4. `database/procedure.sql`

### Reload the data

```bash
./seeding.sh
```

The script drops and recreates the `fincan` database inside the `fincan-db-1` container, then loads
`schema.sql`, `seed_customers.sql` and `seed.sql`. Use `docker compose ps` to check the container
name if yours differs.

### Reset everything

```bash
docker compose down -v      # also removes the mysql_data volume
docker compose up --build
```

## Run without Docker

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_NAME=fincan
DB_USER=root
DB_PASSWORD=<your password>
JWT_SECRET=<generate one>
SESSION_SECRET=<generate one>
```

`SESSION_SECRET` is mandatory: the server exits with an error if it is missing. Generate secrets with
`openssl rand -base64 48`.

Then:

```bash
npm install
npm start
```

The server syncs the Sequelize models with `sequelize.sync()` at startup, so an empty `fincan`
database is enough. To load the sample data manually:

```bash
mysql -u root -p fincan < ../database/schema.sql
mysql -u root -p fincan < ../database/seed_customers.sql
mysql -u root -p fincan < ../database/seed.sql
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The webpack dev server listens on http://localhost:3000. The API base URL is hardcoded to
`http://localhost:5001` in the contexts, so the backend must be reachable there.

The backend CORS configuration allows `http://localhost` and `http://localhost:3000` with
credentials, which covers both the Docker setup (port 80) and the dev server.

## Tests

```bash
cd backend
npx jest
```

## Troubleshooting

- **Port already in use** — change the host side of the mapping in `docker-compose.yml`
  (`"5001:5000"`, `"8080:80"`, `"3307:3306"`), then rebuild.
- **Database schema changes are ignored** — the SQL files only run when the `mysql_data` volume is
  empty. Use `./seeding.sh` or `docker compose down -v`.
- **`npm ci` fails on the frontend image** — the lock file must be present and in sync with
  `package.json`; both lock files are versioned, do not delete them.
- **CORS errors from a different host** — the allowed origins are hardcoded in `backend/server.js`;
  add your origin there or serve the frontend from port 80 / 3000.
- **`SESSION_SECRET is not defined`** — the backend needs `.env` when it runs outside Docker; inside
  Docker Compose the value comes from `docker-compose.yml`.
