const fs = require('fs');
const path = require('path');

module.exports = class UserDatabaseService {
  _pathDatabase = path.resolve('database/users.json');

  getUsersFromDatabase() {
    return new Promise((resolve, rejects) =>
      fs.readFile(this._pathDatabase, { encoding: 'utf-8' }, (err, data) => {
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
      fs.writeFile(this._pathDatabase, JSON.stringify(users, null, 4), err => {
        if (err) {
          return rejects(err.message);
        }
        resolve();
      })
    );
  }
};
