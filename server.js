const express = require('express')
const moment = require('moment')
const { Server } = require('socket.io')

const app = express()
const server = require('node:http').createServer(app)
const io = new Server(server)

var UsersModel = require('./public/js/app/Models/User')
var ChannelsModel = require('./public/js/app/Models/Channel')
var MessageModel = require('./public/js/app/Models/Message')

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

server.listen(8080);

// log server started
console.log("[SERVER][ON]")

var usersList = new UsersModel.Users();
var channelsList = new ChannelsModel.Channels(usersList.users);
var usersConnected = [];
var history = 20;

io.sockets.on('connection', function (socket) {

	var usr;
	var channels = channelsList.channels;
	var channel = channelsList.getGeneralChannel();

	socket.on('login', function (userPseudo) {
		usr = usersList.users.find(user => user.pseudo == userPseudo)
		if (usr) {
			usersConnected.push(usr);

			//log authen
			console.log(`[Auth][Login] ${usr.fullname} => ${new Date(Date.now()).toLocaleString()}`);

			// logged event 
			socket.emit('logged', usersList.users, usr);

			// switch to general channel
			socket.emit('chanSwitch', channel);

			// show current users login
			for (var k in usersConnected) {
				socket.emit('usrconnect', usersConnected[k]);
			}

			//feed client with channel messages
			for (var k in channels) {
				if (channels[k].messages.length > 0) {
					for (var l in channels[k].messages) {
						var message = channels[k].messages[l]
						socket.emit('newmsg', message, channels[k]);
						if(message.target.id == usr.id || message.target == '') {
							channels[k].messages[l].isNew = false;
						}
					}
				}
			}

			// alert user connexion to other users
			io.sockets.emit('usrconnect', usr);
		} else {
			socket.emit('badlogin');
		}
	});

	socket.on('newmsg', function (messageData) {
		// build messageObjet
		target = messageData.target != '' ? usersList.users.find(user => user.id == messageData.target.replace('user_', '')) : '';
		message = new MessageModel.Message(usr, target, messageData.message, moment().format("DD/MM/yyyy à HH:mm:ss"), Date.now());

		// log message
		console.log(`[Message][New] ${usr.fullname} -> ${message.target == '' ? 'commun' : message.target.fullname} => ${moment().format()}`);

		// save messageObject
		channel.messages.push(message);
		if (channel.messages.lenght > history) {
			channel.messages.shift();
		}

		// broadcast it
		io.sockets.emit('newmsg', message, channel);

		// check if target is login
		for (var k in usersConnected) {
			if (usersConnected[k] == message.target || message.target == '') {
				message.isNew = false;
			}
		}
	})

	socket.on('chanSwitch', function (targetUserId) {
		channel = channelsList.getChannelByUsers(usr, usersList.getUser(targetUserId));
		socket.emit('chanSwitch', channel)

		// send message of this channel
		for (var k in channel.messages) {
			// isNewMessage to false if isUserTarget
			if (channel.messages[k].target == '' || channel.messages[k].target.id == usr.id) {
				channel.messages[k].isNew = false;
			}
			socket.emit('newmsg', channel.messages[k], channel);
		}
	})

	socket.on('deleteMessage', function(messageTimestemp) {
		message = channel.messages.find(message => message.timestemp == messageTimestemp);
		if (message) {
			console.log(`[Message][Delete] ${usr.fullname} -> ${channel.users.length == 2 ? (channel.users[0] == channel.users[1] ? usr.fullname : channel.users.find(user => user.id != usr.id).fullname) : 'commun'} => ${moment().format()}`);
			io.sockets.emit('deleteMessage', message.timestemp);
			channel.messages.splice(channel.messages.indexOf(message), 1);
		}
	})

	socket.on('disconnect', function () {
		if (!usr) {
			return false;
		}
		console.log(`[Auth][Logout] ${usr.fullname} => ${moment().format()}`);
		usersConnected.splice(usersConnected.indexOf(usr), 1);
		io.sockets.emit('disusr', usr);
	})
});


