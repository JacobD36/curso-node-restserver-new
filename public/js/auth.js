const miFormulario = document.querySelector('form');
miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(resp => resp.json()).then(resp => {
        if (!resp.token) {
            return console.error('Error en la data enviada');
        }
        localStorage.setItem('token', resp.token);
        window.location = 'chat.html';
    }).catch(err => {
        console.error(err);
    });
});

function handleCredentialResponse(response) {
    //Google Token: ID_TOKEN
    const body = {
        id_token: response.credential
    }

    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(resp => resp.json()).then(({ token, usuario }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', usuario.correo);
        window.location = 'chat.html';
    }).catch(console.warn);
}