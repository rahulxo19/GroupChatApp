const chatContainer = document.querySelector(".chat-container");
const chatHistory = document.querySelector(".chat-history");
const msg = document.getElementById("message");
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const f = document.getElementById("file");
const token = localStorage.getItem("email");
const chatInput = document.getElementsByClassName("chat-input");
const msgs = [];
const messages = localStorage.getItem("messages", JSON.stringify(msgs));

if (!token) {
  document.querySelector("body").innerHTML =
    "<h1 class = 'text-center'>Login First<h1>";
}

const config = {
  headers: {
    Authorization: token,
  },
};

function getMessages(groupId) {
  localStorage.setItem("groupid", groupId);
  let msgInterval;
  if (msgInterval) {
    clearInterval(msgInterval);
  }

  msgInterval = setInterval(async () => {
    let oldMessages = localStorage.getItem("oldmessages");
    let lastMessageId = 0;
    if (oldMessages != undefined || JSON.parse(oldMessages).length == 0) {
      lastMessageId = -1;
    } else {
      oldMessages = JSON.parse(localStorage.getItem("oldmessages"));
      lastMessageId = +oldMessages[oldMessages.length - 1].id;
      // console.log(lastMessageId);
    }
    const newMessages = await axios.get(
      `http://localhost:3000/chat/getChats?lastmessageid=${lastMessageId}&groupid=${groupId}`,
      config
    );

    if (lastMessageId == -1) {
      const oldMessages = JSON.stringify(newMessages.data.slice(-15));
      localStorage.setItem("oldmessages", oldMessages);
    } else if (newMessages.data.length > 0) {
      const oldMessages = JSON.parse(localStorage.getItem("oldmessages"));

      const concatMessages = oldMessages.concat(newMessages.data);

      let slicedMessages;
      if (concatMessages.length > 15) {
        slicedMessages = concatMessages.slice(-15);
      }

      localStorage.setItem("oldmessages", JSON.stringify(slicedMessages));
    }

    messagesToShow = JSON.parse(localStorage.getItem("oldmessages"));

    showMessages(messagesToShow);
  }, 1000);
}

async function showMessages(messages) {
  let chat = [];
  messages.forEach((message) => {
    var name = "";
    if (message.user.id == localStorage.getItem("id")) {
      name = "";
      msgclass = "chat-input";
      msgcolor = "mymsgcolor";
    } else {
      name = message.user.name + ":";
      msgclass = "";
      msgcolor = "othermsgcolor";
    }

    chat += `
        <div class="mb-2 ${msgcolor}">
            <div class = "container ms-0 ps-0">
            <div class="row">
                <div class="col mt-1 mb-1">
                    <span id = "sendername" class = "${msgclass}">${name}</span>
                    <span class = "${msgclass}" autofocus>${message.chat}</span>
                </div>
            </div>
            </div>
        </div>
        `;
  });

  document.querySelector("#message").innerHTML = chat;
}

window.addEventListener("DOMContentLoaded", async (e) => {
  chatContainer.onsubmit = async (e) => {
    e.preventDefault();
    const message = input.value;
    const groupId = localStorage.getItem("groupid");
    const userId = localStorage.getItem("id");
    const fName = f.files[0];

    if (!message && !fileName) return;

    if(fName){
      changeFile(fName);
    }
    // Send message
    if (message) {
      await axios.post(
        `http://localhost:3000/chat/postChat?groupId=${groupId}`,
        { message: message },
        config
      );
    }
    f.value = "";

    document.querySelector("#logout").onclick = () => {
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      window.location.href = "./signin";
    };
  };
});

function changeFile(input) {
  var file = input;
  var reader = new FileReader();
  reader.addEventListener('load', function(event) {
    var formData = new FormData();
    formData.append('file', file, file.name);
    postFile(formData);
  });
  reader.readAsDataURL(file);
}

async function postFile(formData) {
  try {
    console.log(formData);
    const res = await axios.post('http://localhost:3000/chat/file', formData, {
      headers : {
        ...config.headers,
        'group-id': localStorage.getItem('groupid')
      }
    });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

