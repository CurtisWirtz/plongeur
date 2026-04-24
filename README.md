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
1. x - model unverified user
2. view for endpoint
3. serializer for model
2. post request email input
3. create the new object and return data
4. display the OTP - test if new code is created for each object
5. test expiration date of OTP


Full signup map:
1. 
- frontend /register, submit email (mutation) to /api/register/request-otp (with csrf token)
- backend /api/register/request-otp checks csrf token, checks if email is taken by unverified or existing user
  - backend ON FAIL: if email is taken by either unverifieduser (not is_expired) or user, send response saying the email is already taken
  - backend ON SUCCESSFUL CREATION:
    - if unverifieduser email matches but is_expired=true, delete row from DB table 
    - creates a new row in DB table, reserving the email with 24HR exiration date OTP
    - dispatch celery/redis to send email (with mailgun)
    - response 200 OK, and send a stored session variable `request.session['pending_email'] = email`
2. 
- if/when frontend gets OK 200, then routes to /register/verify with the `session['pending_email']`. This is the success/"check your email" screen with an OTP input
  - /register/verify-otp has a loader/guard that checks for `session['pending_email']` to determine which email is being registered. 
  - page has a 'resend verification code' link/button
    - should say "please allow a few minutes for the email to appear in your inbox"
  
  - DONT FORGET TO CLEANUP SESSION with del `request.session['pending_email']` at the end of the 


- once successful...
- final flow:
- create OTP model
- create signup email form route api endpoint
- user register email (it holds for 24 hours)
- checks if the email is already registered to OTP or account
- celery delegates email task to redis
- redis sends email verification link
- if email link is clicked/OTP entered, they're prompted to create the user... set password, phone number, first & last name..etc

- rate limit requests for register/login/OTP reset/finalize

- testing frontend flow logic

- 404 page: (notFoundComponent on frontend)

- docker prune cronjob on production server: every night at 3:00 AM ...using bash? `0 3 * * * /usr/bin/docker system prune -af --volumes`
    (addresses the remnant <none> containers that could accumulate and burn up resources)

    in the meantime, running `docker image prune` will cleanse the dangling containers - they tend to be 0B large anyways...
make PWA
make live, production /w AWS?