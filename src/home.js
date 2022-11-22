import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocuments, createDocument, createFolder} from './document-rest';


$(() => {
  const token = sessionStorage.getItem("token");
  reloadFolder();

  $('#createDocument').on('click', () => {
    createDocument(token, $('#documentName').val());
  });

  $('#createFolder').on('click', () => {
    const res = createFolder(token, $('#documentName').val(), sessionStorage.getItem('currentDirectory'));

    res.then((response) => {
      if (response.ok) {
        window.location.reload();
      }
    })
  })
})

const reloadFolder = () => {
  const token = sessionStorage.getItem("token");
  const res = getDocuments(token, sessionStorage.getItem('currentDirectory'));

  res.then((response) => {
    if (response.ok) {
      response.text().then((text) => {
          const folderResponse = JSON.parse(text);
          console.log(folderResponse);
          sessionStorage.setItem('previousDircetory', folderResponse['folder']['parentId'])
          sessionStorage.setItem('currentDirectory', folderResponse['folder']['id']);
          $('#documentList').empty();
          folderResponse['subFolders'].forEach((element) => {
            $('#documentList')[0].appendChild(createLi(element, true));
          });
          folderResponse['folder']['innerDocuments'].forEach(element => {
              $('#documentList')[0].appendChild(createLi(element, false));
          });
      })
    }
  });
}

const createLi = (element, isFolder) => {

  if (isFolder) {
    return createLiFolder(element);
  } else {
    return createLiDocument(element);
  }
}

const createLiDocument = (element) => {
  const template = $('#list-item')[0].content.cloneNode(true);
  
  const title = template.querySelectorAll("h6");
  title[0].innerText = element['title'];

  const button = template.querySelectorAll("button");
  button[0].addEventListener("click", () => {
      window.location.assign("./doc.html?id=" + element['id']);
  })
  return template;
}

const createLiFolder = (element) => {
  const template = $('#list-item')[0].content.cloneNode(true);
  
  const img = template.querySelectorAll("img");
  img[0].src = "https://img.icons8.com/color/100/000000/folder-invoices.png"

  const title = template.querySelectorAll("h6");
  title[0].innerText = element['name'];

  const button = template.querySelectorAll("button");
  button[0].addEventListener("click", () => {
    sessionStorage.setItem('currentDirectory', element['id']);
    reloadFolder();
  })
  return template;
}
