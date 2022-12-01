import $ from 'jquery'
import {openConnection, disconnect } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getDocument , shareDocument} from './document-rest';
import { appendItemsToListWithRoles } from './doc-functions';
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
  })
})

$('#back-from-doc').on('click', () => {
    const token = sessionStorage.getItem("token");
    const documentId = sessionStorage.getItem('documentId');
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
