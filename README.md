<a name="readme-top"></a>

## API to manage users and login with them

<details>
<summary>Table of contents</summary>

- [About](#about)
- [Getting started](#getting-started)
	- [Prerequisites](#prerequisites)
	- [Instalation](#instalation)
- [Endpoints](#endpoints)
- [Tests](#tests)


</details>

## About

- This is an API to manage users, that means you can create, update and delete these ones, and also you can have a session with them.
- It's a porject created with nodejs and postgresql.
- Docker is used to improve develop and instalation process.
</p>

## Getting started

### Prerequisites
- You must have docker version 19.03.0 or later
- You must have docker compose version 1.27.0 or later
- You might have rest client vs code extension for testing endpoints (optional)

### Instalation
1. Clone the repository
```sh
  git clone https://github.com/dleonardoq/loginApi.git
```
2. Move into loginApi directory
```sh
  cd loginApi
```
3. Env file configuration
	- First you have to create the .env file with the .env.example file
 	```sh
	  cp .env.example .env
	```
  	- Values from the variables POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS should have the same values that are in the docker-compose.yml file, here an example:

	![](https://raw.githubusercontent.com/dleonardoq/Myimages/main/docker-compose.png?token=GHSAT0AAAAAACSOKSP3IVXJP7NB6Q7NDVWCZSH7P7A)
 	- Value from variable POSTGRES_DB should have also, the same value in init.sql file, in this example, our db is called users, like this:

  	![](https://raw.githubusercontent.com/dleonardoq/Myimages/main/sql_file.png?token=GHSAT0AAAAAACSOKSP2YXCV7Z6KEIBNHUIAZSH7SGQ)
   	- Variable POSTGRES_DB_DEV is the same than POSTGRES_DB, but with docker-compose-dev.yml and dev.sql files
   	- POSTGRES_PORT is usually 5432, this is the port that postgres usually uses
   	- POSTGRES_HOST and POSTGRES_HOST_DEV should use the name of the postgres docker container, you can see this in the docke-compose.yml and docke-compose-dev.yml files, like this:

	 ![](https://raw.githubusercontent.com/dleonardoq/Myimages/main/docker_psql_name.png?token=GHSAT0AAAAAACSOKSP2TVR323JK2Y36MY6OZSH7ZKA)
	in this example our host is login_psql, this is for prod, for dev is the same but with docker-compose-dev.yml

	- The rest of the variables are on you, JWT_KEY is to validate if a user is logged (it's a text), JWT_EXPIRES how long the session will be (5m, 1h, etc) and ERR_LOG_FILE is the directory to create a log file, example: './logs/error_logs.log'
	 	
3. Start Docker Desktop if you have it (ignore this step if you only have docker engine)
4. Run the next command if is in a develop environment
```sh
  docker compose -f docker-compose-dev.yml up
```
5. Run the next command if is in a production environment
```sh
  docker compose  up
```
6. You can test the different endpoints with the file api.http in the directory Resources, there's a admin user created by default to start, you can delete it after
7. Before use almost all endpoints, you need to login 'cause this return a JWT

### Endpoints
#### These endpoints return a json
- GET http://localhost:3000/user
	- Get all users, you need to send the JWT in the Authorization header
- GET http://localhost:3000/user?id=document_number
	- Get only one user acording to the user document number, you need to send the JWT in the Authorization header
- POST http://localhost:3000/user
	- Create a new user, you need to send the JWT in the Authorization header and body with the next parameters:
 ```sh
{
  // this is an example
  "document_type": "CC",
  "document_number": 111111,
  "first_name": "first name ",
  "last_name": "lasta name",
  "age": age,
   "birthdate": "YYYY-MM-DD",  //date has to have this format
  "email":"email",
  "user_password":"password"
}
```
- PATCH http://localhost:3000/user/{user_document_number}
	-  Update an user according to the user document number, you need to send the JWT in the Authorization header and in the body the parameters you want to update, Example:
```sh
{
  // this is an example
  "first_name": "first name ",
  "last_name": "lasta name",
  "age": age,
  "email":"email",
}
```
Here we're updating first_name, last_name, age and email of the given user document number
- DELETE http://localhost:3000/user/{user_document_number}
	- Delete an user, according to the user document number, you need to send the JWT in the Authorization header
- POST http://localhost:3000/user/login
	- Log in, this endpoint returns a JWT, it has to be used for the rest of the endpoints
 	- You need to send an email and an user password in the body with the same parameter names:

```sh
{
  // this is an example
  "email":"email",
  "user_password":"password"
}
```
### Tests
#### These tests should be only executed in develop environment, these are going to use the db and create registers in it
1. Docker dev containers have to be running
```sh
{
  docker compose -f docker-compose-dev.yml up
}
```
2. Enter to the project directory
3. Before running test, be sure you have all dependencies by running
```sh
  pnpm install
```
4. Open the terminal an type:
```sh
  pnpm run test
```
<p align="right">(<a href="#readme-top">Go back up</a>)</p>
