import $ from 'jquery'
import { openConnection } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocument} from './document-rest';


const body = $(() => {
  const token = sessionStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  
  const documentId = urlParams.get('id');
  const res = getDocument(documentId, token);
  let doc;
  res.then((response) => {
    if (response.ok) {
      response.text().then((text) => {
          doc = JSON.parse(text).document;
          const role = JSON.parse(text).role
          $('#doc-name')[0].textContent = doc['title'];
          $('#main-doc').val(doc['body']);
          if(role!="EDITOR"){
            $('#main-doc').prop('readonly',true);
          } else{
            $('#main-doc').prop('readonly',false);
          }
          return doc['body'];
      })
    }
  })
})

openConnection();

export {body}