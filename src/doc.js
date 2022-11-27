import $ from 'jquery'
import { openConnection , openConnectionViewers } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocument , getDocumentViewers} from './document-rest';


const body = $(() => {
  const token = sessionStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  
  const documentId = urlParams.get('id');
  const res = getDocument(documentId, token);
  let doc;
  res.then((response) => {
    if (response.ok) {
      response.text().then((text) => {
          doc = JSON.parse(text);
          $('#doc-name')[0].textContent = doc['title'];
          $('#main-doc').val(doc['body']);
          return doc['body'];
      })
    }
  });

  $(".popup").on('click', function() {
      myFunction();
    });
  })

  $('#export_btn').on('click', () => {
    var link = document.createElement('a');
    link.download = $('#doc-name')[0].textContent + '.txt';
    var blob = new Blob([$('#main-doc').val()], {type: 'text/plain'});
    link.href = window.URL.createObjectURL(blob);
    link.click();
  })
})
openConnectionViewers();

function myFunction() {
    let popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

openConnection();

export {body}
