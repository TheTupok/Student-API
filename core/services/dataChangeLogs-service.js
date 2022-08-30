const fs = require('fs');
const path = require('path');
const _pathUndo = path.resolve('./database/dataChangedLogs.json');

module.exports = class UndoService {
  getChangedData() {
    return new Promise((resolve, rejects) =>
      fs.readFile(_pathUndo, { encoding: 'utf-8' }, (err, data) => {
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

  updateChangedData(data) {
    return new Promise((resolve, rejects) =>
      fs.writeFile(_pathUndo, JSON.stringify(data, null, 4), err => {
        if (err) {
          return rejects(err.message);
        }
        resolve();
      })
    );
  }

  async writeChangedData(reqType, OldObject, newObject) {
    const allDataLogs = await this.getChangedData();
    const data = {};

    data['id'] = Math.max(0, ...allDataLogs.map(x => x.id)) + 1;
    data['oldObject'] = OldObject;
    data['newObject'] = newObject;
    data['reqType'] = reqType;
    data['canceled'] = false;

    allDataLogs.push(data);

    return new Promise((resolve, rejects) =>
      fs.writeFile(_pathUndo, JSON.stringify(allDataLogs, null, 4), err => {
        if (err) {
          return rejects(err.message);
        }
        resolve();
      })
    );
  }
};
