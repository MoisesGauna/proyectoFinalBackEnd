class userRepository {
    
    constructor(dao){
        this.dao = dao;
    }

    async getAllUsers(username) {
        const user = await this.dao.getAllUsers();
        return user;
    }

    async getUser(condition){
        const user = await this.dao.getUser(condition);
        return user;
    }

    async getUsers(username) {
        const user = await this.dao.getUsers(username);
        return user;
    }

    async regUser(username, name, lastname, tel, email, password) {
        const newUser = await this.dao.regUser(username, name, lastname, tel, email, password);
        return newUser;
    }

    async logInUser(username, password) {
        const user = await this.dao.logInUser(username, password);
        return user;
    }

    async updateUser(id, user) {
        const userUp = await this.dao.updateUser(id, user);
        return userUp;
    }


}
export { userRepository }