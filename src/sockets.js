import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import $ from 'jquery'
import { serverAddress } from "./constants"
import { update ,addViewers} from './doc-functions';


let stompClient;

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
    console.log(viewer);
    addViewers(viewer);
    
}
const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');
const token = sessionStorage.getItem("token");

const onConnected = () => {
    console.log("subscribing to messages");
    stompClient.subscribe('/topic/updates/', onMessageReceived);
    console.log("subscribing to viewers");
    stompClient.subscribe('/topic/viewers/', onViewerReceived);
    console.log("arrive to on connected viewers");
    stompClient.send("/app/join/", [],
        JSON.stringify({ user: token , docId:documentId})
    )
}

const openConnection = () => {
    const socket = socketFactory();
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected);
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

const disconnect = (user, documentId) => {
    stompClient.send("/app/deleteViewer/", {token:user},
    documentId
        //JSON.stringify({docId:documentId, token: user})
    )
    stompClient.disconnect();
}

export { openConnection, addUpdate,stompClient, disconnect }