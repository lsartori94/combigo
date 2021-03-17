# combigo
Proyecto para la materia Ingenieria de Software 2 de la Universidad Nacional de La Plata
## Stack
### Frontend
- React

### Backend
- Node.JS
- Express
- PostgreSQL

## Pre-requisitos
- Node.JS 14.5 o superior
- Docker
- Docker Compose

## Instalar Dependencias
- [Instalar Node.JS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Instalar Docker](https://docs.docker.com/get-docker/)
- Navegar a [combigo-api](./comgo-api) y luego ejecutar `npm i`
- Navegar a [combigo-ui](./comgo-ui) y luego ejecutar `npm i`

## Ejecutar la App
- Navegar a la raiz del proyecto (combigo)
- Ejecutar `docker-compose up` (si es la 1era vez, va a tomar unos minutos)
- En un navegador, navegar a [localhost:3000](http://localhost:3000) para ver la UI
- En un navegador (o cliente HTTP), navegar a [localhost:5000](http://localhost:5000) para obtener el endpoint base de la API.
