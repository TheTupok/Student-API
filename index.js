const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');

const UserMapper = require('./core/user-mapping');
const UserDatabaseService = require('./core/services/student-service');
const UserCredentials = require('./database/UserCredentials.json');

const JWT_SECRET = '1a2b-3c4d-5e6f-7g8h';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jsonwebtoken.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

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
    return res.json(allUsers);
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

app.post('/users', authenticateToken, async (req, res) => {
  const newUser = req.body;
  const allUsers = await dbservice.getUsersFromDatabase();

  const newId = Math.max(0, ...allUsers.map(x => x.id)) + 1;

  req.body['id'] = newId;
  allUsers.push(newUser);

  await dbservice.writeUsersToDatabase(allUsers);

  res.json(newId);
});

app.post('/auth', (req, res) => {
  const { login, password } = req.body;

  for (let user of UserCredentials) {
    if (login === user.login && password === user.password) {
      return res.status(200).json({
        token: jsonwebtoken.sign({ id: user.id }, JWT_SECRET),
      });
    }
  }

  return res
    .status(401)
    .json({ message: 'The username and password your provided are invalid' });
});

app.put('/users', authenticateToken, async (req, res) => {
  const allUsers = await dbservice.getUsersFromDatabase();
  const user = allUsers.find(x => x.id === req.body.id);
  if (user == null) {
    return console.log(`id:${req.body.id} - does not exist`);
  }

  UserMapper.mapUserToUserDTO(user, req.body);

  await dbservice.writeUsersToDatabase(allUsers);

  res.json(true);
});

app.delete('/users/:id', authenticateToken, async (req, res) => {
  const allUsers = await dbservice.getUsersFromDatabase();
  await dbservice.writeUsersToDatabase(
    allUsers.filter(x => x.id != req.params.id)
  );
  res.json(true);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
