# Northcoders News API

## Summary

This project demonstrates the creation of an API to access application data programmatically. The goal was to create something similar to a real-world backend service, like Reddit, in order to supply information to the front end of the application.

A user can interact with news articles, topics, users and comments. These are the tables that are created in the database.

The application uses [node-postgres](https://node-postgres.com/) to interact with a PostgreSQL database. It also makes use of git hooks using Husky, so that the test files will automatically run before any commit. The documentation is [here](https://typicode.github.io/husky/#/).

---

The hosted version of this project can be viewed here: https://nc-news-m199.onrender.com. The API endpoint documentation can be found at https://nc-news-m199.onrender.com/api.

---

## Getting Started

Begin by **cloning** the project in your local directory from this GitHub repository: https://github.com/kwildeDev/be-nc-news.git.
In the terminal or CLI enter the command:

```
git clone https://github.com/kwildeDev/be-nc-news.git
```

### Prerequisites

To run this project locally you will need to create environment variables after cloning. Create two files as follows in the local repo at root level:

```
 .env.test
 .env.development
```

In each file enter the line `PGDATABASE=database_name_here`, replacing `database_name_here` with the **test database** for `.env.test`, and with the **development database** for `.env.development`.

The database names can be found in the file `/db/setup.sql` within the repo.

### Installing

You will need to run `npm install` to install required node packages and dependencies.

The recommended version of Node.js to run the project is `v22.6.0`.
Postgres version `pg@8.8.0` is also recommended.

To fill the local database with initial data enter the command `npm run-seed` into the terminal or CLI within your local repository. This will populate the databases with development data which can be found at `db/data/development-data`.

## Running the tests

To run the automated Jest tests for the backend part of this project enter the command `npm test`.

The test files use dedicated test data which is recreated every time the tests are run. This data can be found at `db/data/test-data`

### Unit Tests

Backend unit tests can be found in the `__tests__` directory in these files:

```
utils.test.js
app.test.js
```

## Deployment

This project has been deployed with [Supabase](https://supabase.com/) and [Render](https://render.com/).

## Built With

* JavaScript
* [Node.js](https://nodejs.org/en)
* [PostgreSQL](https://www.postgresql.org/)

## Authors

* **Katherine Wilde** - *Work on building and testing the api* - [kwildeDev](https://github.com/kwildeDev)

* **Northcoders** - *Database creation, seeding and utilities files*

## Acknowledgments

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
