class Channel {
    constructor(id, users){
        this.id = id;
        this.users = users;
        this.messages = new Array();
    }
}

class Channels {
    constructor(users){
        this.channels = CreateChannels(users);
    }

    getChannelByUsers(user1, user2) {
        for (var index in this.channels) {
            if (user1 == user2) {
                if (this.channels[index].users[0] == user1 && this.channels[index].users[1] == user2) {
                    return this.channels[index];
                }
            } else {
                if (this.channels[index].users.includes(user1) && this.channels[index].users.includes(user2)) {
                    return this.channels[index];
                }
            }
        }
        return this.getGeneralChannel();
    }

    getChannelById(id) {
        var channelReturn = null;
        this.channels.forEach((channel) => {
            if (channel.id == id) {
                channelReturn = channel;
            }
        })
        return channelReturn ? channelReturn : this.getGeneralChannel();
    }

    getGeneralChannel() {
        return this.channels[this.channels.length - 1];
    }
}

function CreateChannels(users){
    var channelsArray = [];
    var id = 0;
    var count = 0;
    for(var k in users){
        var l = count;
        for(l; l < users.length; l++){
            channelsArray.push(new Channel(id, [users[k],users[l]]));
            id++;
        }
        count++;
    }
    channelsArray.push(new Channel(id, users));
    return channelsArray;
}

module.exports = {Channels};