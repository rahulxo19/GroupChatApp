const chatContainer = document.querySelector(".chat-container");
const message = document.getElementById("message");
const input = document.getElementById("input");
// const submit = document.querySelector("#submit");
const submit = document.getElementById("submit");
console.log(submit);

const token = localStorage.getItem("email");

submit.onclick = async() => {
  const chat = input.value;
  console.log(chat);
  const res = await axios.post("http://localhost:3000/postChat", { chat, headers : { Auth : token }})
  if(res.status === 200){
    console.log(res.data.chat);
  } else {
    console.log(res.message);
  }
}

async function Display() {
  const res = await axios.get("http://localhost:3000/chat", {
    headers: { Auth: token },
  });
  if (res.status === 200) {
    for (const response in res.data.currentUsers) {
      let user = document.createElement("p");
      user.appendChild(
        document.createTextNode(`${res.data.currentUsers[response]} joined`)
      );
      user.className = "sender";
      console.log(message);
      message.appendChild(user);
    }
  } else {
    console.log(res.data.message);
  }
}

async function getChats() {
  const res = await axios.get("http://localhost:3000/getChats", { headers : { Auth: token }})
  if(res.status === 200){
    for (const response in res.data.logs){
      let chat = document.createElement("p");
      chat.appendChild(document.createTextNode(res.data.logs[response]))
      chat.className = "chat-input";
      message.appendChild(chat);
    }
  } else {
    console.log(res.data.message);
  }
}

window.addEventListener('load', async() => {
  await Display();
  await getChats();
})
