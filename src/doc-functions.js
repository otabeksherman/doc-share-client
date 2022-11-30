import $ from 'jquery'
import { addUpdate } from './sockets';


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
        addUpdate($('#userInput').val(), event.originalEvent.data, end-1)
    })
})

const update = (updateData) => {
    let textArea = $('#main-doc');
    let user = $('#userInput').val();
    let start = textArea.prop("selectionStart");
    if (user != updateData.user) {
        let text = textArea.val();
        text = text.substring(0, updateData.position) + updateData.content + text.substring(updateData.position, text.length);
        textArea.val(text);
        if (updateData.position < start) {
            start++;
            textArea[0].setSelectionRange(start, start);
        }
    }
}

export { update }