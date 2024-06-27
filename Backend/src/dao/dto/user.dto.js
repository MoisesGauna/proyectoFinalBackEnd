export default class userDTO{
    constructor(user){
        this.email = user.username;
        this.first_name = user.name;
        this.last_name = user.lastname;
        this.tel = user.tel;
    }

}