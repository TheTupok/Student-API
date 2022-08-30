# Student-API 

server project with node and express. This server can get, get by ID, add, modify and delete users. 

# How to start the server

<p>npm install, npm run start. Open browser url http://localhost:5000 </p>
<p>Url to go to the swagger page http://localhost:5000/api-docs </p>

# Server implementation

Used Express for restapi. Swagger was used to generate templates and methods for the client (swagger.json). Used JWT token to implement login and check if the user can use any requests. To work with files, the standard fs node js was used. 

# Working with users through a hash

There is also a per-user hash check so that you can only work with new data. After each createUser and editUser operation, a new random hash is written from randomString.

# Architecture

index.js contains the main body of the server. database folder contains users and registered users. file handling is in core/services/student-services.js
