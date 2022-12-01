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
      if (response.ok) {
        response.text().then((text) => {
          sessionStorage.setItem("token", text);
          window.location.replace("./home.html");
        });
      }
      else{
        window.alert("The email or password are incorrect");
      }
    });
  })
})