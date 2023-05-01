const chatContainer = document.querySelector(".chat-container");
const message = document.getElementById("message");

const token = localStorage.getItem("name");

async function Display() {
  const res = await axios.get("http://localhost:3000/chat", {
    headers: { Auth: token },
  });
  if (res.status === 200) {
    for (const response in res.data.currentUsers) {
      let user = document.createElement("p");
      user.appendChild(
        document.createTextNode(`${res.data.currentUsers[response]} have joined`)
      );
      user.className = "sender";
      console.log(message);
      message.appendChild(user);
    }
  } else {
    console.log(res.data.message);
  }
}

Display();
