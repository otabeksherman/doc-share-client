import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {logout} from './rest'
import {getDocuments, createDocument, createFolder, importDocument, moveDocument, moveFolder} from './document-rest';

const currentSubFolders = new Map();

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
  
  $('#logout').on('click', () => {
    const res = logout(token);
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

  $('#import').on('click', () => {
    if ($('#fileToImport')[0].files[0]) {
      const folder = JSON.parse(sessionStorage.getItem('directories')).at(-1);
      const file = $('#fileToImport')[0].files[0];
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const res = importDocument(token, file.name, folder, reader.result);
        res.then((response) => {
          if (response.ok) {
            reloadFolder();
          }
        })
      }
    }
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

  $('#dialog').hide();

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
            currentSubFolders.clear();
            folderResponse['subFolders'].forEach((element) => {
              currentSubFolders.set(element['name'], element['id']);
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
  let returnValue = null
  if (isFolder) {
    returnValue = createLiFolder(element);
  } else {
    returnValue = createLiDocument(element);
  }

  return returnValue;
}

const createLiDocument = (element) => {
  const template = $('#list-item')[0].content.cloneNode(true);
  
  const title = template.querySelectorAll("h6");
  title[0].innerText = element['title'];

  const button = template.querySelectorAll("button");
  button[0].addEventListener("click", () => {
      window.location.assign("./doc.html?id=" + element['id']);
  })

  const selectDiv = template.querySelector('#dialog');
  const select = template.querySelector('#select');
  const moveButton = template.querySelector("#move_to_folder");
  moveButton.addEventListener("click", () => {
    if (selectDiv.style.display == 'flex') {
      selectDiv.style.display = 'none';
    } else {
      selectDiv.style.display = 'flex';
      let options = Array.from(currentSubFolders).map(([name, id]) => '<option value=' + id + '>' + name + '</option>').join('\n');
      select.innerHTML = '<option value=-1>parent</option>\n' + options;
    }
  })

  const confirm = template.querySelector("#confirmMove");
  confirm.addEventListener("click", () => {
    const moveFetch = moveDocument(sessionStorage.getItem("token"), element['id'], select.value);

    moveFetch.then((response) => {
      if (response.ok) {
        reloadFolder();
      }
    })
  })
  return template;
}

const createLiFolder = (element) => {
  const template = $('#list-item')[0].content.cloneNode(true);
  
  const img = template.querySelector("#type");
  img.src = "https://img.icons8.com/color/100/000000/folder-invoices.png"

  const title = template.querySelectorAll("h6");
  title[0].innerText = element['name'];

  const button = template.querySelector("#main-btn");
  button.addEventListener("click", () => {
    const folders = JSON.parse(sessionStorage.getItem('directories'));
    folders.push(element['id']);
    sessionStorage.setItem('directories', JSON.stringify(folders));
    console.log(folders);
    reloadFolder();
  })

  const selectDiv = template.querySelector('#dialog');
  const select = template.querySelector('#select');
  const moveButton = template.querySelector("#move_to_folder");
  moveButton.addEventListener("click", () => {
    if (selectDiv.style.display == 'flex') {
      selectDiv.style.display = 'none';
    } else {
      selectDiv.style.display = 'flex';
      let options = ""
      currentSubFolders.forEach((value, key) => {
        if (value != element['id']) {
          options += '<option value=' + value + '>' + key + '</option>\n'
        }
      })
      select.innerHTML = '<option value=-1>parent</option>\n' + options;
    }
  })

  const confirm = template.querySelector("#confirmMove");
  confirm.addEventListener("click", () => {
    const moveFetch = moveFolder(sessionStorage.getItem("token"), element['id'], select.value);

    moveFetch.then((response) => {
      if (response.ok) {
        reloadFolder();
      }
    })
  })

  return template;
}
