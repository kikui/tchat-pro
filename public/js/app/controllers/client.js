(function ($) {
    var usr = null;
    var target = '';
    var channel = null;
    //var url = 'http://localhost:8080/';
    var url = '192.168.1.24:8080'
    var socket = io.connect(url);

    // <============================================================================================= audio
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'sound/messenger_sound.mp3');

    audioElement.addEventListener('ended', function() {
        this.pause();
    }, false);

    audioElement.addEventListener("canplay",function(){});

    // <============================================================================================= Socket

    socket.on('logged', function (usersList, user) {
        usr = user;
        setTimeout(function() { initListener(); }, 100)
    });

    socket.on('newmsg', function (message, channelData) {
        if (usr == null) {
            return false;
        }

        var isTarget = false;
        channelData.users.forEach((user) => {
            if (user.id == usr.id && (message.target.id == user.id || message.target == '')) { 
                isTarget = true 
            }
        })
        // send notification
        if (message.isNew && isTarget) {
            sendNotification(message, channelData);
        }

        // display message
        if (channelData.id == channel.id) {
            displayMessage(message);
        }
    });

    socket.on('chanSwitch', function (channelData) {
        channel = channelData;
        $('#messages').empty();
        $('#messageinput').focus();
    })

    socket.on('deleteMessage', function(messageTimestemps) {
        $(`#${messageTimestemps}`).remove();
        $('#messageinput').focus();
    })

    // <============================================================================================= Method 

    function sendNotification(message, channelData) {
        if (message.from.id != usr.id) {
            if(channelData.id != channel.id){
                var isGeneralMessage = message.target == '' ? ' dans le channel général' : '';
                var notification = new Notification('Tchat Pro', { body: 'Nouveau message de ' + message.from.fullname + isGeneralMessage });
                notification.onshow = function () {
                    setTimeout(notification.close.bind(notification), 10000);
                };
                if (message.target == '') {
                    $('#user_').css('background', 'rgb(255, 153, 0, 0.9)');
                } else {
                    $('#user_' + message.from.id).css('background', 'rgb(255, 153, 0, 0.9)');
                }
            }
            // soung notification
            audioElement.play();
        }
    }

    function displayMessage(message) {
        if (message.from.id == usr.id) {
            $('#messages').append('<div class="message-right" id="' + message.timestemp + '"><div class="info-right"><span><strong>' + message.from.fullname
                + '</strong></span><p class="date">' + message.date + '</p><p class="msg">' +
                message.message + '</p><i class="fas fa-trash delete-message" idByTimestemp="' + message.timestemp + '"></i></div></div>');
        } else {
            $('#messages').append('<div class="message-left" id="' + message.timestemp + '"><div class="info-left"><span><strong>' + message.from.fullname
                + '</strong></span><p class="date">' + message.date + '</p><p class="msg">' +
                message.message + '</p><i class="fas fa-trash delete-message" idByTimestemp="' + message.timestemp + '"></i></div></div>');
        }
        $('#messages').animate({ scrollTop: $('#messages').prop('scrollHeight') }, 50);
        resetDeleteMessageListener();
    }

    // <============================================================================================= JQuery listener 

    function resetDeleteMessageListener() {
        $('.delete-message').off();
        $('.delete-message').on('click', function() {
            console.log('delete')
            socket.emit('deleteMessage', $(this).attr('idByTimestemp'));
        })
    }

    function initListener() {
        // init starter css
        $('#user_').css('background', 'rgb(176,196,222, 0.9)').css('border-bottom', 'green 4px solid');

        // listener post new message
        $('#form').submit(function (event) {
            if ($('#messageinput').val() != '') {
                socket.emit('newmsg', { message: $('#messageinput').val(), target: target })
                $('#messageinput').val('');
                $('#messageinput').focus();
            }
        });

        // listener change channel
        $('.usercard').on('click', function () {
            console.log('test')

            // return if isSameUser or isSameChannel
            if ($(this).attr('id').replace('user_', '') == target) { return false; }
    
            // reset usercard css
            $('.usercard').each((index, usercard) => {
                if (!$(usercard).css('background').includes('rgba(255, 153, 0, 0.9)')) {
                    $(usercard).css('background', 'rgb(255, 255, 255, 0.9)');
                }
            })
    
            // send target channel
            target = $(this).attr('id').replace('user_', '');
            socket.emit('chanSwitch', target);
    
            // this usercard css update
            $(this).css('background', 'rgb(176,196,222, 0.9)');
            $('#messageinput').focus();
        })
    }

})(jQuery)