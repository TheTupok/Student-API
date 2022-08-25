const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();
const UserMapper = require('./core/user-mapping');
const UserDatabaseService = require('./core/services/student-service');
const bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

const dbservice = new UserDatabaseService();

app.get('/users', async (req, res) => {
  const allUsers = await dbservice.getUsersFromDatabase();
  if (req.query['filter']) {
    const searchTerm = req.query['filter'].toLowerCase();

    const filteredUser = allUsers.filter(
      user =>
        user?.name?.toLowerCase().includes(searchTerm) ||
        user?.group?.toLowerCase().includes(searchTerm) ||
        user?.course?.toLowerCase().includes(searchTerm)
    );
    res.json(filteredUser);
  } else {
    res.json(allUsers);
  }
});

app.get('/users/:id', async (req, res) => {
  const allUsers = await dbservice.getUsersFromDatabase();
  res.json(allUsers.find(x => x.id == req.params.id));
});

app.get('/swagger-json', (req, res) => {
  fs.readFile('./swagger.json', { encoding: 'utf-8' }, (err, data) => {
    res.end(data);
  });
});

app.post('/users', async (req, res) => {
  const newUser = req.body;
  const allUsers = await dbservice.getUsersFromDatabase();

  const newId = Math.max(0, ...allUsers.map(x => x.id)) + 1;

  req.body['id'] = newId;
  allUsers.push(newUser);

  await dbservice.writeUsersToDatabase(allUsers);

  res.json(newId);
});

app.put('/users', async (req, res) => {
  const allUsers = await dbservice.getUsersFromDatabase();
  const user = allUsers.find(x => x.id === req.body.id);
  if (user == null) {
    return console.log(`id:${req.body.id} - does not exist`);
  }

  UserMapper.mapUserToUserDTO(user, req.body);

  await dbservice.writeUsersToDatabase(allUsers);

  res.json(true);
});

app.delete('/users/:id', async (req, res) => {
  const allUsers = await dbservice.getUsersFromDatabase();
  await dbservice.writeUsersToDatabase(
    allUsers.filter(x => x.id != req.params.id)
  );
  res.json(true);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
