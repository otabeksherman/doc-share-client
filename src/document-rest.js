import $ from 'jquery'
import { serverAddress } from "./constants"

const createDocument = (token, name) => {
    const fetchPromise = fetch(serverAddress + "/api/v1/doc/create?title=" + name + "&token=" + token, {
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

const getDocuments = (token) => {

    const fetchPromise = fetch(serverAddress + "/api/v1/doc/all?token=" + token, {
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

export{getDocuments, createDocument, getDocument}