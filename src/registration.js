import $ from 'jquery'
import { createUser } from './rest';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/registration.css"

$(() => {
  $("#activationMailSent").hide()
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

  $(document).on('submit', async (e) => {
    e.preventDefault();
    if (!e.checkValidity) {
      e.stopPropagation();
    }

    const user = {
      email: $('#emailInput').val(),
      name: $('#userInput').val(),
      password: $('#passwordInput').val()
    }
    let response = await createUser(user);
    if (response.ok) {
      showActivationEmailSent();
    }
  });
})

function showActivationEmailSent() {
  $(".container").hide();
  $("#activationMailSent").show();
}
