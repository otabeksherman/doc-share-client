import $ from 'jquery'
import { serverAddress } from "./constants"

const createDocument = (token) => {
    const fetchPromise = fetch(serverAddress + "/api/v1/doc/create?title=ooblah&token=" + token, {
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

    const fetchPromise = fetch(serverAddress + "/user/documents?token=" + token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    fetchPromise.then((response) => {
      if (response.ok) {
        response.text().then((text) => {
            console.log(text);
            const arr = JSON.parse(text);
            console.log(arr);
            arr.forEach(element => {
                $('#documentList')[0].appendChild(createLi(element));
            });
        })
      }
    });
}

const createLi = (element) => {
    const template = $('#list-item')[0].content.cloneNode(true);
    
    //const img = template.querySelectorAll("img");
    //console.log(img);
    //img[0].src = "https://img.icons8.com/color/100/000000/folder-invoices.png"
    const title = template.querySelectorAll("h6");
    title[0].innerText = element['title'];

    const spans = template.querySelectorAll("span");
    spans[1].innerText = element['body'];

    const button = template.querySelectorAll("button");
    button[0].addEventListener("click", () => {
        window.location.assign("./doc.html?id=" + element['id']);
    })

    return template;
}

export{getDocuments, createDocument}