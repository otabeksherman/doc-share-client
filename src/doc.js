import $ from 'jquery'
import {openConnection, disconnect } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocument , shareDocument, getLogs} from './document-rest';
import { appendItemsToListWithRoles } from './doc-functions';
import '../styles/doc.css'
import {getUsersWithAccess} from "./rest";


$(() => {
    const token = sessionStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');
    sessionStorage.setItem('documentId', documentId)
    const res = getDocument(documentId, token);
    res.then((response) => {
        if (response.ok) {
            response.text().then((text) => {
                const doc = JSON.parse(text).document;
                const role = JSON.parse(text).role
                $('#doc-name')[0].textContent = doc['title'];
                $('#main-doc').val(doc['body']);
                if(role!="EDITOR"){
                    $('#main-doc').prop('readonly',true);
                } else{
                    $('#main-doc').prop('readonly',false);
                }
            });
        }
    });

    $(".share-button").on('click', function () {
        $(".share-popup").show();
        listUsers()
    });

    $("#close").on("click", function () {
        $(".share-popup").hide();
    });

    $('#submitViewer').on('click', async (e) => {
        e.preventDefault();
        if (!e.checkValidity) {
            e.stopPropagation();
        }
        const shareRequest = {
            token: sessionStorage.getItem('token'),
            email: $('#emailInput').val(),
            documentId: sessionStorage.getItem('documentId'),
            role: "VIEWER"
        }
        const response = await shareDocument(shareRequest);
        if (response.ok) {
            console.log('Shared successfully')
        }
    });

    $('#submitEditor').on('click', async (e) => {
        e.preventDefault();
        if (!e.checkValidity) {
            e.stopPropagation();
        }

        const shareRequest = {
            token: sessionStorage.getItem('token'),
            email: $('#emailInput').val(),
            documentId: sessionStorage.getItem('documentId'),
            role: "EDITOR"
        }
        const response = await shareDocument(shareRequest);
        if (response.ok) {
            console.log('Shared successfully');
        }
    });

  $('#export_btn').on('click', () => {
    var link = document.createElement('a');
    link.download = $('#doc-name')[0].textContent + '.txt';
    var blob = new Blob([$('#main-doc').val()], {type: 'text/plain'});
    link.href = window.URL.createObjectURL(blob);
    link.click();
  });

  $('#logs-button').on('click', async () => {
      $("#changes").empty();
      let token = sessionStorage.getItem('token');
      let documentId = sessionStorage.getItem('documentId');
      let response = await getLogs(token, documentId);
      if (response.ok) {
          response.text().then((text) => {
              let usersResponse = JSON.parse(text);
              let logWindow = document.getElementById("changes");
              let display = getComputedStyle(logWindow).display;
              if (display == "none") {
                  logWindow.style.display = "block";
              } else {
                  logWindow.style.display = "none";
              }
              let textArea = document.createElement("textarea");
              textArea.readOnly = true;
              textArea.setAttribute('id','logs')
              // textArea.appendChild(document.createTextNode(usersResponse));
              usersResponse.forEach(element => {
                  console.log(element);
                  textArea.appendChild(document.createTextNode(`[${element['lastModified']}]: 
                  Text: ${element['body']} 
                  Position Range: ${element['startPosition']}-${element['endPosition']} 
                  Made by: ${element['email']} \n`));
              })
              logWindow.appendChild(textArea);
          })
      }
  })
})


$('#back-from-doc').on('click', () => {
    const token = sessionStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');
    disconnect(token, documentId);
})

function listUsers() {
    console.log("Listing users...")
    const token = sessionStorage.getItem("token");
    const documentId = sessionStorage.getItem('documentId');
    const res = getUsersWithAccess(token, documentId)

    res.then((response) => {
        if (response.ok) {
            response.text().then((text) => {
                const usersResponse = JSON.parse(text);

                const owners = usersResponse['OWNER'].map(element => element['email']);
                const viewers = usersResponse['VIEWER'].map(element => element['email']);
                const editors = usersResponse['EDITOR'].map(element => element['email']);

                $("#list-users").empty();

                appendItemsToListWithRoles(owners, "owner", "list-users");
                appendItemsToListWithRoles(editors, "editor", "list-users");

                const filtered = viewers.filter(viewer => !editors.includes(viewer));
                appendItemsToListWithRoles(filtered, "viewer", "list-users");
            })
        }
    })
}

openConnection();
