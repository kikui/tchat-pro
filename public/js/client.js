(function ($) {

    var usr = '';
    var target = 'G';
    var channel = 'G';
    var url = 'http://192.168.0.37:8080';

    var socket = io.connect(url);

    socket.on('logged', function () {
        usr = $('#logininput').val().toUpperCase();
        $('#login').fadeOut();
        $('#loginform').fadeOut();
        $('#messageinput').focus();
    });

    $('#form').submit(function (event) {
        if ($('#messageinput').val() != '') {
            socket.emit('newmsg', { message: $('#messageinput').val(), target: target })
            $('#messageinput').val('');
            $('#messageinput').focus();
        }
    });

    socket.on('newmsg', function (message) {
        if (usr != '') {
            if (message.new == true) {
                if ((message.chan.includes(usr) || message.chan == 'G') && message.user.username != usr) {
                    var notification = new Notification('Nouveau message', { body: 'De ' + message.user.username + ' sur le channel ' + message.chan });
                    notification.onshow = function () {
                        setTimeout(notification.close.bind(notification), 10000);
                    };
                    if (message.chan !== 'G') {
                        $('#' + message.user.username).css('background', 'rgb(255, 153, 0, 0.9)');
                    }
                }
            }
            if (message.chan == channel) {
                if (message.user.username == usr) {
                    $('#messages').append('<div class="message-right"><div class="info-right"><span><strong>' + message.user.username
                        + '</strong></span><p class="date">' + message.d + '/' + message.M + ' à ' + message.h + ':' + message.m + '</p><p class="msg">' +
                        message.message + '</p></div></div>');
                } else {
                    $('#messages').append('<div class="message-left"><div class="info-left"><span><strong>' + message.user.username
                        + '</strong></span><p class="date">' + message.d + '/' + message.M + ' à ' +message.h + ':' + message.m + '</p><p class="msg">' +
                        message.message + '</p></div></div>');
                }
                $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 50);
            }
        }
    });

    socket.on('chanchange', function (chanid) {
        channel = chanid;
        $('#band').empty();
        $('#messages').empty();
        $('#band').append(chanid);
    })

    $('#TH').click(function () {
        if ((target == 'G' || target != 'TH') && (usr != 'TH')) {
            target = 'TH';
            $('#TH').css('background', 'rgb(176,196,222, 0.9)');
            if ($('#CP').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#CP').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#BC').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#BC').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#TL').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#TL').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#VB').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#VB').css('background', 'rgb(255, 255, 255, 0.9)');
            }
        } else if (target == 'TH') {
            target = 'G';
            $('#TH').css('background', 'rgb(255, 255, 255, 0.9)');
        }
        $('#messageinput').focus();
        socket.emit('chanchange', { user: usr, target: target });
    })
    $('#CP').click(function () {
        if ((target == 'G' || target != 'CP') && (usr != 'CP')) {
            target = 'CP';
            if ($('#TH').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#TH').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            $('#CP').css('background', 'rgb(176,196,222, 0.9)');
            if ($('#BC').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#BC').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#TL').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#TL').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#VB').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#VB').css('background', 'rgb(255, 255, 255, 0.9)');
            }
        } else if (target == 'CP') {
            target = 'G';
            $('#CP').css('background', 'rgb(255, 255, 255, 0.9)');
        }
        $('#messageinput').focus();
        socket.emit('chanchange', { user: usr, target: target });
    })
    $('#BC').click(function () {
        if ((target == 'G' || target != 'BC') && (usr != 'BC')) {
            target = 'BC';
            if ($('#TH').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#TH').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#CP').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#CP').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            $('#BC').css('background', 'rgb(176,196,222, 0.9)');
            if ($('#TL').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#TL').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#VB').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#VB').css('background', 'rgb(255, 255, 255, 0.9)');
            }
        } else if (target == 'BC') {
            target = 'G';
            $('#BC').css('background', 'rgb(255, 255, 255, 0.9)');
        }
        $('#messageinput').focus();
        socket.emit('chanchange', { user: usr, target: target });
    })
    $('#TL').click(function () {
        if ((target == 'G' || target != 'TL') && (usr != 'TL')) {
            target = 'TL';
            if ($('#TH').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#TH').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#CP').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#CP').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#BC').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#BC').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            $('#TL').css('background', 'rgb(176,196,222, 0.9)');
            if ($('#VB').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#VB').css('background', 'rgb(255, 255, 255, 0.9)');
            }
        } else if (target == 'TL') {
            target = 'G';
            $('#TL').css('background', 'rgb(255, 255, 255, 0.9)');
        }
        $('#messageinput').focus();
        socket.emit('chanchange', { user: usr, target: target });
    })
    $('#VB').click(function () {
        if ((target == 'G' || target != 'VB') && (usr != 'VB')) {
            target = 'VB';
            if ($('#TH').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#TH').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#CP').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#CP').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#BC').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#BC').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            if ($('#TL').css('background') != 'rgba(255, 153, 0, 0.9) none repeat scroll 0% 0% / auto padding-box border-box') {
                $('#TL').css('background', 'rgb(255, 255, 255, 0.9)');
            }
            $('#VB').css('background', 'rgb(176,196,222, 0.9)');
        } else if (target == 'VB') {
            target = 'G';
            $('#VB').css('background', 'rgb(255, 255, 255, 0.9)');
        }
        $('#messageinput').focus();
        socket.emit('chanchange', { user: usr, target: target });
    })
})(jQuery)