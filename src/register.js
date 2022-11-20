import $ from 'jquery'
import { createUser } from './rest';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css"


$(() => {

  $("#passwordInput").on("focusout", function () {
    if ($(this).val() != $("#repeatPasswordInput").val()) {
      $("#repeatPasswordInput")[0].setCustomValidity("password must match");
    } else {
      $("#repeatPasswordInput")[0].setCustomValidity("");
    }
  });
  
  $("#repeatPasswordInput").on("keyup", function () {
    if ($("#passwordInput").val() != $(this).val()) {
      $(this)[0].setCustomValidity("password must match");
    } else {
      $(this)[0].setCustomValidity("");
    }
  });

  $(document).on('submit', (e) => {
    e.preventDefault();
    if (!e.checkValidity) {
        e.stopPropagation();
    }
    const user = {
      email: $('#emailInput').val(),
      name: $('#userInput').val(),
      password: $('#passwordInput').val()
    }
    createUser(user);
  });
  
})