const dbService = require('../core/services/student-service')

const dbservice = new dbService();


const getUsers = async (req, res) => {
    const allUsers = await dbservice.getUsersFromDatabase();
    res.send(allUsers);
}

const createUser = async (req, res) => {
    const newUser = req.body
    const allUser = await dbservice.getUsersFromDatabase();

    allUser.push(newUser)

    const WriteTo = await dbservice.writeUsersToDatabase(getAllUser);
    res.send(WriteTo);
}

module.exports = {
    getUsers,
    createUser,
}