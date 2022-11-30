import $, { get } from 'jquery'
import { serverAddress } from "./constants"
const createDocument = (token, name, dir) => {
    const fetchPromise = fetch(serverAddress + "/api/v1/doc/create?title=" + name + "&token=" + token + "&folderId=" + dir, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return fetchPromise;
}

const importDocument = (token, name, dir, body) => {
  const fetchPromise = fetch(serverAddress + "/api/v1/doc/import?title=" + name + "&token=" + token + "&folderId=" + dir, {
    body: body,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  return fetchPromise;
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
const getDocumentViewers = (id) => {
  const fetchPromise = fetch(serverAddress + "/viewers/", {
    method:get,
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

const moveDocument = (token, documentId, folderId) => {
  const fetchPromise = fetch(serverAddress + "/api/v1/doc/move/" + documentId + "?token=" + token + "&folderId=" + folderId, {
    method : 'PATCH'
  });

  return fetchPromise;
}

const moveFolder = (token, folderId, destinationId) => {
  const fetchPromise = fetch(serverAddress + "/api/v1/folder/move/" + folderId + "?token=" + token + "&destinationId=" + destinationId, {
    method : 'PATCH'
  });

  return fetchPromise;
}

const shareDocument = (shareRequest) => {
  const fetchPromise = fetch(serverAddress + "/api/v1/doc/share", {
    method : 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shareRequest)
  });
  return fetchPromise;
}

export{getDocuments, createDocument, getDocument, createFolder, shareDocument, importDocument, getDocumentViewers, moveDocument, moveFolder}
