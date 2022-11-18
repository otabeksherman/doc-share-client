import $ from 'jquery'
import { login } from './rest';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css"


$(() => {

  $(document).on('submit', () => {
    const user = {
      email: $('#emailInput').val(),
      password: $('#passwordInput').val()
    }
    login(user);
  })


  
})