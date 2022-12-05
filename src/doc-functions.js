import $ from 'jquery'
import {addUpdate} from './sockets';

const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');
const token = sessionStorage.getItem("token");

//set input listeners
$(() => {

    const input = $('#main-doc');

    input.on('keydown', (event) => {
        const keyEvent = event.originalEvent;
        const key = keyEvent.code;
        console.log(key);
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
        } else if (key == 'Enter') {
            const end = input.prop("selectionEnd");
            addUpdate(token, "APPEND", "\n", end,documentId);
        }
    });

    input.on("input", (event) => {
        if (!event.originalEvent.inputType == 'insertText') {
            return;
        }

        console.log("type: " + event.originalEvent.inputType);
        console.log("data: " + event.originalEvent.data);
        console.log(event.originalEvent);
        
        const end = input.prop("selectionEnd");
        const data = event.originalEvent.data;
        if (data == null) return;
        addUpdate(token, "APPEND", data, end-1,documentId);
    });
    
    input.on("paste", (pasteEvent) => {
        const start = input.prop("selectionStart");
        addUpdate(token, "APPEND_RANGE", pasteEvent.originalEvent.clipboardData.getData('text'), start,documentId);
    });
})

const update = (updateData) => {
    const textArea = $('#main-doc');
    let start = textArea.prop("selectionStart");
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');
    if (sessionStorage.getItem('email') != updateData.email && updateData.documentId == documentId) {
        let text = textArea.val();
        //change text based on update gotten
        switch (updateData.type) {
            case 'DELETE':
            case 'DELETE_RANGE':
                text = text.substring(0, updateData.position) + text.substring(updateData.position + updateData.content.length, text.length);
                break;
            case 'APPEND':
            case 'APPEND_RANGE':
                text = text.substring(0, updateData.position) + updateData.content + text.substring(updateData.position, text.length);
                break;
        }
        textArea.val(text);
        //move cursor forward if needed
        if (updateData.position < start) {
            if (updateData.type == 'APPEND' || updateData.type == 'APPEND_RANGE') {
                start += updateData.content.length;
            } else {
                start-=Math.max(updateData.content.length, 0);    
            }  
        }
        textArea[0].setSelectionRange(start, start);
    }
}
const addViewers = (mapViewers) => {
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');
    const usersResponse = mapViewers[documentId];

    let owners = [];
    let viewers = [];
    let editors = [];
    for (let [key, value] of Object.entries(usersResponse)) {
        switch(value) {
            case 'OWNER':
                owners.push(key);
            case 'VIEWER':
                viewers.push(key);
            case 'EDITOR':
                editors.push(key);
        }
    }

    $("#active-users").empty();

    appendItemsToListWithRoles(owners, "owner", "active-users");
    appendItemsToListWithRoles(editors, "editor", "active-users");

    const filtered = viewers.filter(viewer => !editors.includes(viewer));
    appendItemsToListWithRoles(filtered, "viewer", "active-users");
}

function appendItemsToListWithRoles(elements, role, listId) {
    const ul = document.getElementById(listId);
    elements.forEach(element => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        li.appendChild(document.createTextNode(element));
        const span = document.createElement("span");
        span.classList.add("badge", role);
        span.appendChild(document.createTextNode(role));
        li.appendChild(span);
        ul.appendChild(li);
    })
}
export { update , addViewers, appendItemsToListWithRoles}