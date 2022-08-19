module.exports = class UserMapper {
    static mapUserToUserDTO(user, changedUser){
        for(var key in user){
            user[key] = changedUser[key]
        }
    }
}