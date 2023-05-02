const chatContainer = document.querySelector(".chat-container");
const chatHistory = document.querySelector(".chat-history");
const message = document.getElementById("message");
const input = document.getElementById("input");
// const submit = document.querySelector("#submit");
const submit = document.getElementById("submit");
console.log(submit);

const token = localStorage.getItem("email");

submit.onclick = async() => {
  const chat = input.value;
  console.log(chat);
  const res = await axios.post("http://localhost:3000/postChats", { chat, headers : { Auth : token }})
  if(res.status === 200){
    console.log(res.data.message);
  } else {
    console.log(res.message);
  }
}

async function updateLS(){
  const res = await axios.get("http://localhost:3000/getChats", {
    headers: { Auth: token },
  });
  if (res.status === 200) {
    localStorage.setItem('chats', JSON.stringify(res.data.logs));
    localStorage.setItem('lastChat', res.data.lastChat);
    console.log(res);
  } else {
    console.log(res.data.message);
  }

}

async function loggedInUsers() {
  const res = await axios.get("http://localhost:3000/chat", {
    headers: { Auth: token },
  });
  if(res.status === 200) {
    const user = document.createElement('p');
    for(i in res.data.currentUsers){
      user.appendChild(document.createTextNode(`${res.data.currentUsers[i]}: logged in`))
      user.className = "sender";
      message.appendChild(user);
    }
  }
  else {
    console.log('error in loggedInUser');
  }
}

async function Display() {
  const chats = JSON.parse(localStorage.getItem('chats'));
  console.log(chats.length);
  let arr = "";
  for(let i = chats.length-1; i>=0 ; i--){
    let chat = document.createElement("p");
    chat.appendChild(document.createTextNode(chats[i]))
    arr+= chats[i];
    chat.className = "chat-input";
    message.appendChild(chat);
  }
}

async function getChats() {
  const lastChat = localStorage.getItem('lastChat');
  const res = await axios.get(`http://localhost:3000/latestChats?createdAt=${lastChat}`, {
    headers: { Auth: token },
  });
  if(res.status === 200){
    const chats = res.data.logs;
    if(lastChat != res.data.lastChat){
      localStorage.setItem('lastChat', res.data.lastChat)
      for(let i = chats.length-1; i>=0 ; i--){
        let chat = document.createElement("p");
        chat.appendChild(document.createTextNode(chats[i]))
        chat.className = "chat-input";
        message.appendChild(chat);
      }
    }
  }
}


window.addEventListener('DOMContentLoaded', async() => {
  await loggedInUsers();
  await updateLS();
  await Display();
})

// setInterval(getChats,1000)
// async function updateChats(){
  //   await Display();
  //   await getChats();
  // }
  
  // setInterval(updateChats, 1000)