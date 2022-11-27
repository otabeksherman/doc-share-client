import {activate} from "./rest";
import $ from "jquery";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/activation.css'

$(async () => {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('email')) {

        let email = searchParams.get('email')
        let token;
        if (searchParams.has('token')) {
            token = searchParams.get('token');
            const activation = {
                email: email,
                token: token
            }
            let response = await activate(activation);
            if (response.status == 200) {
                showSuccess();
            } else if (response.status == 401){
                showAlreadyActivated();
            } else {
                showFail();
            }
        }
    }

    function showSuccess() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("success").style.display = "block";
    }

    function showFail() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("fail").style.display = "block";
    }

    function showAlreadyActivated() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("alreadyActivated").style.display = "block";
    }
});

