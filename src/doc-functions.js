import $ from 'jquery'
import { addUpdate, removeUpdate} from './sockets';
import { body } from './doc'
const urlParams = new URLSearchParams(window.location.search);
  
const documentId = urlParams.get('id');
const token = sessionStorage.getItem("token");

$(() => {

    var input = $('#main-doc');

    input.on('keydown', (event) => {
        const keyEvent = event.originalEvent;
        var key = keyEvent.code;
        if (key == 'Delete' || key == 'Backspace') {
            let position = input.prop("selectionStart");
            let deleteVal = input.val().substring(input.prop("selectionStart"), input.prop("selectionEnd"));
            if (!deleteVal) {
                if (key == 'Delete') {
                    deleteVal = input.val().substring(input.prop("selectionStart"), input.prop("selectionEnd")+1);
                    
                } else {
                    if (position == 0) return;
                    deleteVal = input.val().substring(input.prop("selectionStart")-1, input.prop("selectionEnd"));
                    position = position - 1;
                }
                addUpdate(token, "DELETE", deleteVal, position,documentId);
                return;
            }
            console.log("deleting: " + deleteVal);
            addUpdate(token, "DELETE_RANGE", deleteVal, position,documentId);   
        }
    });
    input.on("input", (event) => {
        if (!event.originalEvent.inputType == 'insertText') {
            return;
        }

        console.log("type: " + event.originalEvent.inputType);
        console.log("data: " + event.originalEvent.data);
        console.log(event.originalEvent);
        
        let end = input.prop("selectionEnd");
        let data = event.originalEvent.data;
        if (data == null) return;
        addUpdate(token, "APPEND", data, end-1,documentId);
    })
    
    input.on("paste", (pasteEvent) => {
        let start = input.prop("selectionStart");
        addUpdate(token, "APPEND_RANGE", pasteEvent.originalEvent.clipboardData.getData('text'), start,documentId);
    })
})

const update = (updateData) => {
    let textArea = $('#main-doc');
    let start = textArea.prop("selectionStart");
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');
    if (sessionStorage.getItem('token') != updateData.user && updateData.documentId == documentId) {
        let text = textArea.val();
        switch (updateData.type) {
            case 'DELETE':
                text = text.substring(0, updateData.position) + text.substring(updateData.position + 1, text.length);
                break;
            case 'APPEND':
            case 'APPEND_RANGE':
                text = text.substring(0, updateData.position) + updateData.content + text.substring(updateData.position, text.length);
                break;
            case 'DELETE_RANGE':
                text = text.substring(0, updateData.position) + text.substring(updateData.position + updateData.content.length, text.length);
                break;
        }
        textArea.val(text);
        if (updateData.position < start) {
            if (updateData.type == 'APPEND' || updateData.type == 'APPEND_RANGE') {
                start+=updateData.content.length;        
            } else {
                start-=Math.max(updateData.content.length, 0);    
            }  
        }
        textArea[0].setSelectionRange(start, start);
    }
}

export { update }