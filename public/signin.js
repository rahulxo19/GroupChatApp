const email = document.getElementById('email');
const password = document.getElementById('password');
const submit = document.querySelector('#submit');

submit.onclick = async() => {
    try {
        console.log("submit onclick")
    } catch (err) {
        console.log(err);
    }
}