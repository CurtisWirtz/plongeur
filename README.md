# Plongeur

### Basic instructions for local development:
Clone this repository: `git clone git@github.com:CurtisWirtz/plongeur

Create a copy of `.env.example` named `.env` in the root directory.

With [Docker](https://www.docker.com/) installed, run `docker compose up --build` in this project's root directory.

This will build and run containers for PostgreSQL, Django, and Node.js.
Note: Port `5432` must be available for Postgres.

Create a backend super user:
`docker compose run backend python manage.py createsuperuser`

Backend portal:
http://localhost:8000/admin

View the project in your browser:
http://localhost:5173/

Stop the containers: 
Press Ctrl+C in the terminal, followed by the command `docker compose down`.

With the containers built, `docker compose up` is sufficent for subsequent use.


#### To utilize PGAdmin4 in the browser:
Uncomment the `pgadmin` section in `docker-compose.yml` (lines 39-50 and line 64)
Choose your own login credentials: `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` (lines 45-46) of `docker-compose.yml` 
Then run the `docker compose up --build` command again.

PGAdmin4 will now be avilable in your browser at:
http://localhost:8080

Log in to PGAdmin4 using the values of PGADMIN_DEFAULT_EMAIL and PGADMIN_DEFAULT_PASSWORD.
Register a new server connection:
Host: db (This is the service name of the PostgreSQL container)
Port: 5432
Username: ${DATABASE_USERNAME} (from the .env file)
Password: ${DATABASE_PASSWORD}