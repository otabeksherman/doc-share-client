import $ from 'jquery'
import { addUpdate , stompClient} from './sockets';
import { body } from './doc'
import { serverAddress } from './constants';
const urlParams = new URLSearchParams(window.location.search);

const documentId = urlParams.get('id');
const token = sessionStorage.getItem("token");

$(() => {

    var input = $('#main-doc');

    input.on('keydown', (event) => {
        var key = event.keyCode || event.charCode;
        if (key == 8 || key == 46) {
            console.log("deleting: " + input.val().substring(input.prop("selectionStart"),
                input.prop("selectionEnd")));
        }

    });
    input.on("input", (event) => {
        let end = input.prop("selectionEnd");
        console.log(input.val());
        addUpdate(token,input.val(), end-1,documentId);
    });
    /*$('#back-from-doc').on('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const documentId = urlParams.get('id');
        stompClient.send("/app/deleteViewer/",[],JSON.stringify({docId:documentId,token:token}))
      });*/
})

const update = (updateData) => {
    let textArea = $('#main-doc');
    let start = textArea.prop("selectionStart");
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');
    if (sessionStorage.getItem('token') != updateData.user && updateData.documentId == documentId) {
        let text = textArea.val();
        //text = text.substring(0, updateData.position) + updateData.content + text.substring(updateData.position, text.length);
        textArea.val(updateData.content);
        if (updateData.position < start) {
            start++;
            textArea[0].setSelectionRange(start, start);
        }
    }
}
const addViewer = (listViewer) => {
    let viewers = $('#viewers');
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');
    let text = "";
    const docViewers = listViewer[documentId];
    for(let x in docViewers){
        text+=docViewers[x];
        text+="\n";        
    }
    viewers.val(text);

}
export { update , addViewer}