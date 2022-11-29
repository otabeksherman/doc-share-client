import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import $ from 'jquery'



import { serverAddress } from "./constants"
import { update ,addViewer} from './doc-functions';
let stompClient;
let stompClientViewers;
const socketFactory = () => {
    return new SockJS(serverAddress + '/ws');
}

const onMessageReceived = (payload) => {
    var message = JSON.parse(payload.body);
    console.log(message);
    update(message);
}
const onViewerReceived = (payload) => {
    console.log("on viewer received: ");
    var viewer = JSON.parse(payload.body);
    console.log("on viewer received: " +viewer);
    addViewer(viewer);
}
const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');
const token = sessionStorage.getItem("token");
const viewers=$('#viewers');

const onConnected = () => {
    stompClient.subscribe('/topic/updates/', onMessageReceived);
    stompClient.send("/app/join/", [],
        JSON.stringify({ user: token , docId:documentId})
    )
}

const openConnection = () => {
    const socket = socketFactory();
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected);
}

const onConnectedViewers = () => {
    stompClient.subscribe('/topic/viewers/', onViewerReceived);
    console.log("arrive to on connected viewers");
}

const openConnectionViewers = () => {
    const socket = socketFactory();
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnectedViewers);
}
const addUpdate = (user, type, content, position, docId) => {
    sendUpate(user, type, content, position, docId)
}

const sendUpate = (user, type, content, position,docId) => {
    console.log("this is user: "+user + " type: " + type + " content: " + content + "position: " + position);
    stompClient.send("/app/update/", [], JSON.stringify({
        user: user,
        content: content,
        documentId: docId,
        type: type,
        position: position
    }))
}

export { openConnection, addUpdate,openConnectionViewers,stompClient }