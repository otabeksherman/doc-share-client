import $ from 'jquery'
import {openConnection, openConnectionViewers } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocument , getDocumentViewers, shareDocument} from './document-rest';
import '../styles/doc.css'
import {getUsersWithAccess} from "./rest";


const body = $(() => {
  const token = sessionStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const documentId = urlParams.get('id');
  const res = getDocument(documentId, token);
  let doc;
    res.then((response) => {
        if (response.ok) {
            sessionStorage.setItem('documentId', documentId);
            response.text().then((text) => {
                doc = JSON.parse(text);
          $('#doc-name')[0].textContent = doc['title'];
          $('#main-doc').val(doc['body']);
          return doc['body'];
            })
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
        let response = await shareDocument(shareRequest);
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
        let response = await shareDocument(shareRequest);
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
  })
})

function listUsers() {
    console.log("Listing users...")
    let token = sessionStorage.getItem("token");
    let documentId = sessionStorage.getItem('documentId');
    let res = getUsersWithAccess(token, documentId)

    res.then((response) => {
        if (response.ok) {
            response.text().then((text) => {
                let usersResponse = JSON.parse(text);

                let owners = usersResponse['OWNER'].map(element => element['email']);
                let viewers = usersResponse['VIEWER'].map(element => element['email']);
                let editors = usersResponse['EDITOR'].map(element => element['email']);

                $("#list-users").empty();

                appendItemsToListWithRoles(owners, "owner");
                appendItemsToListWithRoles(editors, "editor");

                let filtered = viewers.filter(viewer => !editors.includes(viewer));
                appendItemsToListWithRoles(filtered, "viewer");
            })
        }
    })
}

function appendItemsToListWithRoles(elements, role) {
    let ul = document.getElementById("list-users");
    elements.forEach(element => {
        let li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        li.appendChild(document.createTextNode(element));
        let span = document.createElement("span");
        span.classList.add("badge", role);
        span.appendChild(document.createTextNode(role));
        li.appendChild(span);
        ul.appendChild(li);
    })
}

openConnectionViewers();


openConnection();

export {body}
