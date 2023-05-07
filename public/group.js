const form = document.getElementById("createGroupForm");
const groupName = document.getElementById("groupName");
const groupAdmins = document.getElementById("admins");
const groupMembers = document.getElementById("members");
const gps = document.getElementById("groups");
const IsEdit = document.getElementById("isedit");

async function createGroup(group) {
  const res = await axios.post(
    "http://localhost:3000/groups/postGroup",
    group,
    config
  );
  console.log(res);
  groupName.value = "";
  groupAdmins.value = "";
  groupMembers.value = "";
}


async function getGroups() {
  try {
    const res = await axios.get("http://localhost:3000/groups/", config);
    return res.data;
  } catch (err) {
    console.log(err.message);
  }
}

async function deleteGroup(groupId) {
    console.log(groupId);
  const response = await axios.delete(
    `http://localhost:3000/groups/${groupId}`,
    config
  );

  if (response.status == 200) {
    const groups = await getGroups();
    showGroups(groups);
  }
}

async function getGroup(groupId) {
  const response = await axios.get(
    `http://localhost:3000/groups/${groupId}`,
    config
  );
  const group = response.data;
  console.log(group);

  const groupname = group.name;

  let members = "";
  let admins = "";
  group.users.forEach((user) => {
    members += user.name + ", ";
    if (user.asAdmin) {
      admins += user.name + ", ";
    }
  });
  groupName.value = groupname;
  groupMembers.value = members;
  groupAdmins.value = admins;
  IsEdit.value = groupId;
}

async function editGroup(newGroup, groupId) {
  const response = await axios.put(
    `http://localhost:3000/groups/${groupId}`,
    newGroup,
    config
  );
  groupName.value = "";
  groupMembers.value = "";
  groupAdmins.value = "";
  IsEdit.value = "";
}

function showGroups(groups) {
  let groupHTML = "";
  groups.forEach((group, index) => {
    const groupName = group.name;
    const groupId = group.id;
    adminPerks = "";
    if (group.usergroup.asAdmin) {
      adminPerks = `
            <td>
              <div class="btn-group">
                  <button class="btn btn-sm btn-primary" id = "editgroup">edit</button>
                  <button class="btn btn-sm btn-danger" id = "deletegroup">X</button>
              </div>
            </td>
            `;
    }
    groupHTML += `
        <tr id = ${groupId}>
            <th>${index + 1}</th>
            <td>${groupName}</td>
            ${adminPerks}
        </tr>
        `;
  });
  gps.innerHTML = groupHTML;
}

document.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  form.onsubmit = async (e) => {
    e.preventDefault();
    const name = groupName.value;
    const admins = groupAdmins.value.split(", ");
    const members = groupMembers.value.split(", ");
    const newGroup = {
      name,
      admins,
      members,
    };
    if (IsEdit.value != "") {
      const groupId = IsEdit.value;
      console.log(IsEdit.value);
      editGroup(newGroup, groupId);
    } else {
      createGroup(newGroup);
    }
  };
  
  gps.onclick = async (e) => {
    e.preventDefault();
    isDelete = e.target.id == "deletegroup" ? true : false;
    isEdit = e.target.id == "editgroup" ? true : false;
  
    if (!isDelete && !isEdit) {
      const groupId = e.target.innerHTML.trim()[0];
      localStorage.setItem("oldmessages", JSON.stringify([]));
      getMessages(parseInt(groupId));
    } else if (isDelete) {
      const groupId = e.target.parentNode.parentNode.textContent.trim()[0];
      await deleteGroup(groupId);
    } else if (isEdit) {
      const groupId = e.target.parentNode.parentNode.textContent.trim()[0];
      await getGroup(groupId);
    }
  };
  const group = await getGroups();
  showGroups(group);
});

setInterval(async () => {
    const groups = await getGroups();
    showGroups(groups);
  }, 5000);


