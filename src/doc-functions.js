import $ from 'jquery'
import { addUpdate } from './sockets';
import { body } from './doc'
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
    })
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

export { update }