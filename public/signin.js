const email = document.getElementById('email');
const password = document.getElementById('password');
const submit = document.querySelector('#submit');

submit.onclick = async() => {
    try {
        const obj = {
            email : email.value,
            password : password.value
        }
        const res = await axios.post('http://localhost:3000/signin', obj)
        if(res.status === 200){
            alert("login successful")
            console.log(res.data.data);
            localStorage.setItem("name", res.data.data);
            window.location.href = './chat.html';
        }
        else {
            console.log(res.message);
        }
    } catch (err) {
        console.log(err.message);
    }
}