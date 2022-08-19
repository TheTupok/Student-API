const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();
const UserMapper = require('./src/core/user-mapping');
const UserDatabaseService = require('./src/core/services/student-service');

const dbservice = new UserDatabaseService();


app.get("/users", async (req, res) => {
    const allUsers = await dbservice.getUsersFromDatabase();
    res.send(allUsers);
});

app.get("/users/:id", async (req, res) => {
    const allUsers = await dbservice.getUsersFromDatabase();
    res.send(allUsers.find(x=> x.id == req.params.id));
});

app.post("/users/:id", async (req, res) => {
    const newUser = req.body;
    const allUsers = await dbservice.getUsersFromDatabase();
    
    const newId = Math.max(0, ...allUsers.map((x) => x.id)) + 1;

    req.body["id"] = newId;
    allUsers.push(newUser);

    await dbservice.writeUsersToDatabase(allUsers);

    res.send(newId);
});

app.put("/users/:id", async (req, res) => {
    const allUsers = await dbservice.getUsersFromDatabase();
    const user = allUsers.find(x => x.id === req.body.id);
    if (user == null) {
        return console.log(`id:${req.body.id} - does not exist`);
    }
    
    UserMapper.mapUserToUserDTO(user, req.body);

    res.send(await dbservice.writeUsersToDatabase(allUsers));
});

app.delete("/users/:id", async (req, res) => {
    const allUsers = await dbservice.getUsersFromDatabase();
    await dbservice.writeUsersToDatabase(allUsers.filter(x => x.id != req.params.id));
    res.send(true);
});


app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))