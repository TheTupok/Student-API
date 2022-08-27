module.exports = class UserMapper {
  static mapUserToUserDTO(user, changedUser) {
    for (const key in user) {
      user[key] = changedUser[key];
    }
  }
};
