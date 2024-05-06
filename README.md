<a name="readme-top"></a>

## API to manage users and login with them

<details>
<summary>Table of contents</summary>

- [About](#about)
- [Getting started](#getting-started)
	- [Prerequisites](#prerequisites)
	- [Instalation](#instalation)


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
   https://github.com/dleonardoq/loginApi.git
```
2. Move into loginApi directory
```sh
   cd loginApi
```
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


<p align="right">(<a href="#readme-top">Go back up</a>)</p>