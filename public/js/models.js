class Channel {
    constructor(id){
        this.id = id;
        this.messages = new Array();
    }
}

class Channels {
    constructor(users){
        this.channels = this.getNewChannels(users);
    }

    getChannels(){
        return this.channels;
    }

    getNewChannels(users){
        return CreateChannels(users);
    }

    getChannel(id){
        return this.channels[id];
    }
}

function ChannelName(user1, user2){
    var arrayChannelName = [user1, user2];
    arrayChannelName.sort();
    var idChannel = '';
    for(var k in arrayChannelName){
        idChannel += arrayChannelName[k];
    }
    return idChannel;
}

function CreateChannels(users){
    var channelsArray = {}
    for(var k in users){
        for(var l in users){
            if(k != l){
                var idChannel = ChannelName(users[k],users[l]);
                var channel = new Channel(idChannel);
                channelsArray[channel.id] = channel;
            }
        }
    }
    channelsArray['G'] = new Channel('G');
    return channelsArray;
}

module.exports = {Channels, ChannelName};