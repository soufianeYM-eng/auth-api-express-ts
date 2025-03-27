import swaggerAutogen from 'swagger-autogen';
import path from "node:path"

const doc = {
  info: {
    title: 'Auth API using JWT',
    description: 'A simple app for authentication'
  },
  host: 'localhost:3030',
  basePath: '/auth'
};

const outputFile = './swagger-output.json';
const routes = [path.join(__dirname, './routes/auth.route.ts')];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc).then(async () => {
  await import('./index.ts'); // Your project's root file
});