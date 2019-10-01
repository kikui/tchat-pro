var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
ChannelsModel = require('./public/js/models.js');

server.listen(8080);

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var usersRefArray = ['TH', 'CP', 'BC', 'TL', 'VB'];
var users = {};
var history = 20;
var Channels = new ChannelsModel.Channels(usersRefArray);

io.sockets.on('connection', function (socket) {

    var usr = false;
    var channels = Channels.getChannels();
    var channel = Channels.getChannel('G');

    socket.on('login', function(user) {
        if(usersRefArray.includes(user.username)){
            socket.emit('logged');
            socket.emit('chanchange', channel.id);

            for(var k in users){
                socket.emit('usrconnect', users[k]);
            }

            for(var k in channels){
                if(channels[k].messages.length > 0){
                    for(var l in channels[k].messages){
                        socket.emit('newmsg', channels[k].messages[l]);
                    }
                }
            }

            usr = user;
            users[usr.username] = usr;
            io.sockets.emit('usrconnect', usr);
        }else{
            socket.emit('badlogin');
        }
        
    });

    socket.on('newmsg', function(message){
        message.user = usr;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();
        message.d = date.getDate();
        message.M = date.getMonth() + 1;
        message.chan = channel.id;
        message.new = true;
        io.sockets.emit('newmsg', message);
        for(var k in users){
            if(users[k].username == message.target){
                message.new = false;
            }
        }
        channel.messages.push(message);
        if(channel.messages.lenght > history){
            channel.messages.shift();
        }
    })

    socket.on('chanchange', function(chan){
        if(chan.target == 'G'){
            channel = Channels.getChannel(chan.target);
        } else {
            var setChannel = ChannelsModel.ChannelName(chan.user, chan.target);
            channel = Channels.getChannel(setChannel);
        }
        socket.emit('chanchange', channel.id)
        for(var k in channel.messages){
            channel.messages[k].new = false;
            socket.emit('newmsg', channel.messages[k]);
        }
    })

    socket.on('disconnect', function(){
        if(!usr){
            return false;
        }
        delete users[usr.username];
        io.sockets.emit('disusr', usr);
    })
});


