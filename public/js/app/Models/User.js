class User {
    constructor(id, fullname, pseudo){
        this.id = id;
        this.fullname = fullname;
        this.pseudo = pseudo;
    }
}

class Users {
    constructor() {
        this.users = createUsersList(usersList);
    }

    getUser(id) {
        return this.users.find(user => user.id == id)
    }
}

function createUsersList(list) {
    var mesUsers = Array();
    list.forEach(userData => {
        var user = new User(userData.id, userData.fullname, userData.pseudo)
        mesUsers.push(user)
    });
    return mesUsers;
}

// DB users
var usersList = [
    {id: 2, fullname: "Secrétaire", pseudo: "SE"},
    {id: 1, fullname: "D.THERY", pseudo: "TH"},
    {id: 3, fullname: "D.BAYON", pseudo: "BA"},
    {id: 4, fullname: "D.TRAMOIS", pseudo: "TR"},
    {id: 5, fullname: "D.BARRES", pseudo: "BV"}
]

module.exports = {Users};