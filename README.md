# Plongeur

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
name: plongeur (or whatever)
Go to Connection tab:
Host: db (This is the service name of the PostgreSQL container)
Port: 5432
Username: ${DATABASE_USERNAME} (from the .env file)
Password: ${DATABASE_PASSWORD}

# Useful commands:
`docker compose exec frontend printenv | grep VITE` tests to see if env variables successfully loaded into the frontend container with the word 'VITE' attached

# TODOS:
-create new user (register)
   - view
   - serializer
   - url
   - route, component, form to register new user

- apply Mantine or MUI or ShadCN or BaseUI?
-create authenticated routes (maybe auth provider so we can get that state via context in the header to show current user/conditionally show buttons for login/logout)
   - redirect to protected test route on login and register pages instead of bouncing to home

-add honeypot, captcha? some more security for login/register

   once successful...
 -final flow:
    -first, register email (it holds for 24 hours)
       - OTP model
       - also checks if the email is already registered
    - email verification is sent 
       - if email link is clicked, they're prompted to create the user... set password, phone number, name..etc

- 404 page: (notFoundComponent on frontend)

- docker prune cronjob: every night at 3:00 AM ...using bash? `0 3 * * * /usr/bin/docker system prune -af --volumes`
    (addresses the remnant <none> containers that could accumulate and burn up bandwidth)

    in the meantime, running `docker image prune` will cleanse the dangling containers - they tend to be 0B large anyways...