import $ from 'jquery'
import { login } from './rest';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css"


$(() => {

  $(document).on('submit', (e) => {
    $("#emailInput")[0].setCustomValidity("");
    e.preventDefault();
    const user = {
      email: $('#emailInput').val(),
      password: $('#passwordInput').val()
    }
    const fetchPromise = login(user);

    fetchPromise.then((response) => {
      console.log(response)
      if (response.ok) {
        response.text().then((text) => {
          let userResponse = JSON.parse(text);
          console.log(userResponse["token"])
          console.log(userResponse["email"])
          sessionStorage.setItem("token", userResponse["token"]);
          sessionStorage.setItem("email", userResponse["email"])
          window.location.replace("./home.html");
        });
      }
      else{
        window.alert("The email or password are incorrect");
      }
    });
  })
})