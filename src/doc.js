import $ from 'jquery'
import { openConnection } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocument} from './document-rest';


$(() => {
  const token = sessionStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  
  const documentId = urlParams.get('id');
  const res = getDocument(documentId, token);

  res.then((response) => {
    if (response.ok) {
      response.text().then((text) => {
          const doc = JSON.parse(text);
          $('#doc-name')[0].textContent = doc['title'];
          $('#main-doc').val(doc['body']);
      })
    }
  })
})

openConnection();