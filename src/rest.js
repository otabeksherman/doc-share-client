import { serverAddress } from "./constants"
import $ from "jquery";

const createUser = (user) => {
    return fetch(serverAddress + "/user", {
      method: 'POST',
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
}

const login = (user) => {
  const fetchPromise = fetch(serverAddress + "/api/v1/login", {
    method: 'POST',
    body: JSON.stringify({ email: user.email, password: user.password }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  fetchPromise.then((response) => {
    if (response.ok) {
      response.text().then((text) => {
        sessionStorage.setItem("token", text);
        window.location.replace("./home.html");
      });
    }
  });
}
const logout = (token) => {
  const fetchPromise = fetch(serverAddress + "/user/logout?token=" + token , {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log("in logout function");

    return fetchPromise;
}

const activate = (activation) => {
  return fetch(serverAddress + "/user/confirmRegistration", {
    method: 'PATCH',
    body: JSON.stringify({email: activation.email, token: activation.token}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    return response;
  });
}

export{createUser, login, activate,logout}