(function ($) {
    var socket = io.connect('http://192.168.0.37:8080');

    $('#logininput').focus();

    Notification.requestPermission( function(status) {
        if (Notification.permission !== status) {
            Notification.permission = status;
        }
    });

    $('#loginform').submit(function (event) {
        socket.emit('login', {
            username: $('#logininput').val().toUpperCase()
        })
    });

    socket.on('usrconnect', function(user){
        $('#' + user.username).css('border-bottom', 'green 4px solid');
    });

    socket.on('badlogin', function(){
        $('#badlogin').show();
    })

    socket.on('disusr', function (user) {
        $('#' + user.username).css('border-bottom', 'red 4px solid');
    });
})(jQuery)