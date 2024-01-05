import ClientConnexion from './clientConnexion.js';
import ClientChanel from './clientChanel.js';

const url = 'http://localhost:8080/';
//var url = '192.168.1.150:8080'
const socket = io.connect(url);

new ClientConnexion(socket);
new ClientChanel(socket);