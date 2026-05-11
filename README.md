# Plongeur

# Under Development

### Basic instructions for local development:
Clone this repository: `git clone git@github.com:CurtisWirtz/plongeur`

Create a copy of `.env.example` named `.env` in the root directory.

With [Docker](https://www.docker.com/) installed, run `docker compose up --build` in this project's root directory.
NOTE: appending `--remove-orphans` will prune old containers that are no longer required.

This will build and run containers for PostgreSQL, Django, and Node.js.
Note: Port `5432` must be available for Postgres.

Create a backend super user:
`docker compose run backend python manage.py createsuperuser`

Backend portal:
http://127.0.0.1:8000/admin

View the project in your browser:
http://127.0.0.1:5173/

Stop the containers: 
Press Ctrl+C in the terminal, followed by the command `docker compose down`.

With the containers built, `docker compose up` is sufficent for subsequent use.


#### To utilize PGAdmin4 in the browser:
Uncomment the `pgadmin` section in `docker-compose.yml` (lines 39-50 and line 64)
Choose your own login credentials: `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` (lines 45-46) of `docker-compose.yml` 
Then run the `docker compose up --build` command again.

PGAdmin4 will now be avilable in your browser at:
http://127.0.0.1:8080

- Log in to PGAdmin4 using the values of PGADMIN_DEFAULT_EMAIL and PGADMIN_DEFAULT_PASSWORD set in docker-compose.yml (from .env)
- Register a new server connection:
  - name: plongeur (or whatever)
- Go to Connection tab:
  - Host: db (This is the service name of the PostgreSQL container)
  - Port: 5432
  - Username: ${DATABASE_USERNAME} (from the .env file)
  - Password: ${DATABASE_PASSWORD}

# Useful commands:
`docker compose exec frontend printenv | grep VITE` tests to see if env variables successfully loaded into the frontend container with the word 'VITE' attached

# TODOS:
- end to end testing audit on user security on login/register logic flow
- docker prune cronjob on production server: every night at 3:00 AM ...using bash? `0 3 * * * /usr/bin/docker system prune -af --volumes`, (addresses the remnant <none> containers that could accumulate and burn up resources). in the meantime, running `docker image prune` will cleanse the dangling containers for development when needed
- add PWA manifest.json and JS service worker
- production to AWS EC2, S3
- geolocation access for device
- django RBAC for user groups to access other user device info


thoughts:
-i dont want to have django admin be accessible to a public URL