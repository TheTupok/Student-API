const fs = require('fs');

module.exports = class UserDatabaseService {
  getUsersFromDatabase(path) {
    return new Promise((resolve, rejects) =>
      fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          return rejects(err.message);
        }
        if (data == '') {
          return resolve([]);
        }
        resolve(JSON.parse(data));
      })
    );
  }

  writeUsersToDatabase(path, users) {
    return new Promise((resolve, rejects) =>
      fs.writeFile(path, JSON.stringify(users, null, 4), err => {
        if (err) {
          return rejects(err.message);
        }
        resolve();
      })
    );
  }
};
