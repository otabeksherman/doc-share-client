import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocuments, createDocument} from './document-rest';


$(() => {
  const token = sessionStorage.getItem("token");
  const res = getDocuments(token);

  res.then((response) => {
    if (response.ok) {
      response.text().then((text) => {
          const arr = JSON.parse(text);
          arr.forEach(element => {
              $('#documentList')[0].appendChild(createLi(element));
          });
      })
    }
  });

  $('#create').on('click', () => {
    createDocument(token, $('#documentName').val());
  })
})

const createLi = (element) => {
  const template = $('#list-item')[0].content.cloneNode(true);
  
  //const img = template.querySelectorAll("img");
  //console.log(img);
  //img[0].src = "https://img.icons8.com/color/100/000000/folder-invoices.png"
  
  const title = template.querySelectorAll("h6");
  title[0].innerText = element['title'];

  const button = template.querySelectorAll("button");
  button[0].addEventListener("click", () => {
      window.location.assign("./doc.html?id=" + element['id']);
  })
  return template;
}
