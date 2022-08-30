const fs = require('fs');
const path = require('path');
const _pathDatabaseUser = path.resolve('./database/users.json');

module.exports = class UserDatabaseService {
  getUsersFromDatabase() {
    return new Promise((resolve, rejects) =>
      fs.readFile(_pathDatabaseUser, { encoding: 'utf-8' }, (err, data) => {
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

  writeUsersToDatabase(users) {
    return new Promise((resolve, rejects) =>
      fs.writeFile(_pathDatabaseUser, JSON.stringify(users, null, 4), err => {
        if (err) {
          return rejects(err.message);
        }
        resolve();
      })
    );
  }
};
