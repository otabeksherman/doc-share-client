import { serverAddress } from "./constants"

const createUser = (user) => {
    const fetchPromise = fetch(serverAddress + "/user", {
      method: 'POST',
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    fetchPromise.then((response) => {
      if (response.ok) {
        window.location.replace("./index.html");
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
export{createUser, login}