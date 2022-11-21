import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocuments, createDocument} from './document-rest';


$(() => {
  const token = sessionStorage.getItem("token");
  getDocuments(token);

  $('#create').on('click', () => {
    createDocument(token);
  })
})
