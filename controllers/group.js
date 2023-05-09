const UserGroup = require('../models/userGroup');
const User = require('../models/users');
const Group = require('../models/groups');
const Chat = require('../models/chats');

exports.postGroup = async(req, res) => {
    try{
        const user = req.user;
        const name = req.body.name;
        const members = req.body.members;
        const admins = req.body.admins;
        console.log(members);
        console.log(admins);
        const newGroup = await user.createGroup({
            name : name
        })
        const groupId = newGroup.id;

        members.forEach(async(member) => {
            const user = await User.findOne({ where : { name : member }});
            if(user){
                if(admins.indexOf(user.name) == -1){
                    isAdmin = false;
                } else {
                    isAdmin = true;
                }
                await UserGroup.create({
                    userId : user.id,
                    groupId : groupId,
                    asAdmin : isAdmin
                }, {
                    ignoreDuplicates: true
                })
            }
        })
        res.status(200).json({ success : true });
    } catch(err) {
        console.log("------->" + console.log(err.message));
    }
}

exports.getGroups = async(req, res) => {
    try {
        const user = req.user;
        const groups = await Group.findAll({
            include: [{
                model : UserGroup,
                where : { userId : user.id },
                attributes : ['asAdmin']
            }],
            attributes : ['id','name']
        });
        res.status(200).json(groups);
    } catch(err) {
        console.log("------->" + console.log(err.message));
    }
}

exports.deleteGroup = async(req, res) => {
    try {
        const user = req.user;
        const groupId = req.params.groupId;
        const group = await Group.findOne({ where : {
            id: groupId
        }})
        console.log(group);
        await group.destroy();

        res.status(200).json({ success : true });
    } catch(err) {
        console.log("------->" + console.log(err.message));
    }
}

exports.getGroup = async(req, res) => {
    try {
        const groupId = req.params.groupId;
        const gp = await Group.findByPk(groupId);
        const users = await UserGroup.findAll({
            where : {
                groupId : groupId
            },
            attributes : ['userId', 'asAdmin']
        })
        var groupUsers = [];
        const group = {
            name : gp.name
        }
        for( let i = 0; i < users.length; i++){
            const response = await User.findOne({
                where : {
                    id : users[i].userId
                },
                attributes : ['name']
            })
            const temp = {
                ...users[i].dataValues,
                name : response.name
            }
            groupUsers.push(temp);
        }
        
        group.users = groupUsers;
        res.status(200).json(group);
    } catch(err) {
        console.log("------->" + console.log(err.message));
    }
}

exports.editGroup = async(req, res) => {
    try {
        const group = req.body;
        const groupName = group.name;
        const members = group.members;
        const admins = group.admins;
        const groupId = req.params.groupId;
        console.log(groupName);
        console.log(members);

        await Group.update({ name: groupName }, { where: { id: groupId } });

        await UserGroup.destroy({ where: { groupId: groupId } });

        const newMembers = [];
      for (let member of members) {
        const user = await User.findOne({ where: { name: member } });
        if (user) {
          newMembers.push(user.id);
          await UserGroup.create({ userId: user.id, groupId: groupId, asAdmin: false });
        }
      }

      for (let admin of admins) {
        const user = await User.findOne({ where: { name: admin } });
        if (user) {
            await UserGroup.update({ asAdmin: true }, { where: { groupId: groupId, userId: user.id } });
        }
    }

    const updatedGroup = await User.findAll({
        attributes: ['id', 'name'],
        include: {
          model: UserGroup,
          where: { groupId: groupId },
          attributes: ['asAdmin'],
        },
      });
  
      res.status(200).json({ success: true });

    } catch(err){
        console.log("------->" + console.log(err.message));
    }
}
