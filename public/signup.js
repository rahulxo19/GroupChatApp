const nam = document.getElementById('name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const password = document.getElementById('password');
const submit = document.getElementById('submit');

submit.onclick = async(e) => {
    e.preventDefault();
    console.log('button pressed');
    try{
        const obj = {
            name : nam.value,
            phone : phone.value,
            email : email.value,
            password : password.value
        }
        console.log(obj);
        const res = await axios.post('http://localhost:3000/signup', obj)
        alert(`${res.data}`)
        console.log(res.data);
        window.location.href = './signin.html';
    } catch (err) {
        console.log(err.message);
    }
}
