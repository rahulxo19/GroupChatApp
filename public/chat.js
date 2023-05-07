const chatContainer = document.querySelector(".chat-container");
const chatHistory = document.querySelector(".chat-history");
const msg = document.getElementById("message");
const input = document.getElementById("input");
const submit = document.getElementById("submit");

const token = localStorage.getItem("email");
const msgs = [];
const messages = localStorage.getItem("messages", JSON.stringify(msgs));

const config = {
  headers: {
    Authorization: token
  }
};

function getMessages (groupId){
  localStorage.setItem("groupid",groupId)
  
  if(msgInterval){
      clearInterval(msgInterval)
  }

  var msgInterval =  setInterval(async () => {

      let oldMessages = localStorage.getItem("oldmessages");
      var lastMessageId = 0;
      if(oldMessages != undefined || JSON.parse(oldMessages).length == 0 ){
          lastMessageId = -1;
      }
      else{
          
          oldMessages = JSON.parse(localStorage.getItem("oldmessages"))
          lastMessageId = +oldMessages[oldMessages.length - 1].id
          // console.log(lastMessageId);
      }
      const newMessages = await axios.get(`http://localhost:3000/chat/getChats?lastmessageid=${lastMessageId}&groupid=${groupId}`,config)

      if(lastMessageId == -1){
          const oldMessages = JSON.stringify(newMessages.data.slice(-15));
          localStorage.setItem("oldmessages", oldMessages)
      }
      else if(newMessages.data.length > 0) {

          const oldMessages = JSON.parse(localStorage.getItem("oldmessages"))

          const concatMessages = oldMessages.concat(newMessages.data);

          let slicedMessages ;
          if(concatMessages.length > 15){
              slicedMessages = concatMessages.slice(-15);
          }

          localStorage.setItem("oldmessages",JSON.stringify(slicedMessages))
          
      }

      messagesToShow = JSON.parse(localStorage.getItem("oldmessages"))

      showMessages(messagesToShow);
  },1000)

}

async function showMessages(messages){
    
  let chat = [] ;
  messages.forEach(message => {
    var name = '';
      if(message.user.id == localStorage.getItem('id')){
          name = ""
          msgclass = 'float-end'
          msgcolor = "mymsgcolor"  
      }
      else{
          name = message.user.name + ":"
          msgclass = ""
          msgcolor = "othermsgcolor"
      } 

      chat += `
      <div class="mb-2 ${msgcolor}">
          <div class = "container ms-0 ps-0">
          <div class="row">
              <div class="col mt-1 mb-1">
                  <span id = "sendername" class = "${msgclass} ps-1 pe-1 text-center">${name}</span>
                  <span class = "${msgclass} p-2" autofocus>${message.chat}</span>
              </div>
          </div>
          </div>
      </div>
      `
  });

  document.querySelector("#message").innerHTML = chat
}

window.addEventListener('DOMContentLoaded', async() => {
  submit.onclick = async(e) => {
    if(input.value){
      e.preventDefault();
      const message = input.value;
      input.value = '';
      const groupId = localStorage.getItem('groupid')
      const res = await axios.post(`http://localhost:3000/chat/postChat?groupId=${groupId}`, { message : message }, config );
      if(res.status === 200){
        console.log(res);
      }
    }
}
})