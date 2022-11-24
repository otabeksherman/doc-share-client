import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocuments, createDocument, createFolder, removeFolder} from './document-rest';


$(() => {
  const token = sessionStorage.getItem("token");
  const folders = [];
  sessionStorage.setItem('directories', JSON.stringify(folders));
  reloadFolder();

  $('#createDocument').on('click', () => {
    const res = createDocument(token, $('#documentName').val(), JSON.parse(sessionStorage.getItem('directories')).at(-1));

    res.then((response) => {
      if (response.ok) {
          reloadFolder();
      }
    })
  });

  $('#createFolder').on('click', () => {
    const folder = JSON.parse(sessionStorage.getItem('directories')).at(-1);
    const res = createFolder(token, $('#documentName').val(), folder);

    res.then((response) => {
      if (response.ok) {
        reloadFolder();
      }
    })
  })

  $('#backFolder').on('click', () => {
    const folder = JSON.parse(sessionStorage.getItem('directories'));
    folder.pop();
    sessionStorage.setItem('directories', JSON.stringify(folder));
    
    reloadFolder();
  })
})

const reloadFolder = () => {
  const token = sessionStorage.getItem("token");
  const folder = JSON.parse(sessionStorage.getItem('directories'));
  const res = getDocuments(token, folder.at(-1));

  res.then((response) => {
    if (response.ok) {
      response.text().then((text) => {
          const folderResponse = JSON.parse(text);
          $('#documentList').empty();
          const folders = JSON.parse(sessionStorage.getItem('directories'));
          if (folders.length == 0) {
            folders.push(folderResponse['folder']['id']);
            sessionStorage.setItem('directories', JSON.stringify(folders));
          }
          if (folderResponse['subFolders'] != undefined) {
            folderResponse['subFolders'].forEach((element) => {
              $('#documentList')[0].appendChild(createLi(element, true));
            });
          }
          if (folderResponse['folder']['innerDocuments'] != undefined) {
            folderResponse['folder']['innerDocuments'].forEach(element => {
              $('#documentList')[0].appendChild(createLi(element, false));
          });
          }
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
    const folders = JSON.parse(sessionStorage.getItem('directories'));
    folders.push(element['id']);
    sessionStorage.setItem('directories', JSON.stringify(folders));
    reloadFolder();
  });

  const removeButton = template.querySelector('#remove');
  removeButton.addEventListener("click", () => {
    const res = removeFolder(sessionStorage.getItem('token'), element['id']);

    res.then(() => {
      reloadFolder();
    });
  })
  return template;
}
