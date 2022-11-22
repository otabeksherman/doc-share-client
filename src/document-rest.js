import $ from 'jquery'
import { serverAddress } from "./constants"

const createDocument = (token, name) => {
    const fetchPromise = fetch(serverAddress + "/api/v1/doc/create?title=" + name + "&token=" + token + "&folderId=" + sessionStorage.getItem("currentDirectory"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      fetchPromise.then((response) => {
        if (response.ok) {
            window.location.reload();
        }
      })
}

const getDocuments = (token, currentDirectory) => {
  let dir = "";
  if (currentDirectory != null) {
    dir = "/" + currentDirectory;
  }
    const fetchPromise = fetch(serverAddress + "/api/v1/folder" + dir + "?token=" + token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return fetchPromise;
}

const getDocument = (id, token) => {
  const fetchPromise = fetch(serverAddress + "/api/v1/doc/" + id + "?token=" + token, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return fetchPromise;
}

const createFolder = (token, name, id) => {
  const fetchPromise = fetch(serverAddress + "/api/v1/folder/" + id + "/new?token=" + token + "&name=" + name, {
    method : 'POST'
  });

  return fetchPromise;
}

export{getDocuments, createDocument, getDocument, createFolder}