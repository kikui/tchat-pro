(function ($) {
    //var url = 'http://localhost:8080/';
    var url = '192.168.1.24:8080'
    var socket = io.connect(url)

    $('#logininput').focus();

    Notification.requestPermission( function(status) {
        if (Notification.permission !== status) {
            Notification.permission = status;
        }
    });

    $('#loginform').submit(function (event) {
        socket.emit('login', $('#logininput').val().toUpperCase())
    });

    socket.on('logged', function (usersList, user) {
        $('#login').fadeOut();
        $('#loginform').fadeOut();
        $('#messageinput').focus();
        buildUsersView(usersList, user);
    });

    socket.on('usrconnect', function(user){
        $('#user_' + user.id).css('border-bottom', 'green 4px solid');
    });

    socket.on('badlogin', function(){
        $('#badlogin').show();
    })

    socket.on('disusr', function (user) {
        $('#user_' + user.id).css('border-bottom', 'red 4px solid');
    });
})(jQuery)

function buildUsersView(users, currentUser) {
    // build users card
    var userHTML = []
    userHTML.push(`<div id='user_' class="usercard"><strong>Tout le monde</strong></div>`);
    users.forEach((user) => {
        userHTML.push(`<div id='user_${user.id}' class="usercard"><strong>${user.fullname}</strong></div>`);
    })
    $('#useritem').append(userHTML);

    // show current user
    $('#wellcome').append(`Bienvenue ${currentUser.fullname}`)
}