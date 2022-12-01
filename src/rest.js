import { serverAddress } from "./constants"

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

  return fetchPromise;
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

const getUsersWithAccess = (token, docId) => {
  const requestParams = `?token=${token}&docId=${docId}`;
  const fetchPromise =  fetch(serverAddress + "/api/v1/doc/allowedUsers" + requestParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return fetchPromise;
}

export{createUser, login, logout, activate, getUsersWithAccess}
