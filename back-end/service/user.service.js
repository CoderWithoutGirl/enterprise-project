const User = require("../model/user");

const getAllUser = async () => {
    const qaManager = await User.findOne({role: process.env.QAMANAGER}).sort([["createdAt", "asc"]]);
    const userDb = await User.find({role: process.env.STAFF}).sort([["createdAt", "asc"]]);
    
    return [qaManager, ...userDb];
}

const getUserByUsername = async (username) => {
    return await User.find({username: username}).sort([["createdAt", "asc"]]);
}

const getUserById = async (id) => {
    return await User.findById(id);
}

const assignStaff = async (role, department, id) =>{
    const userInDb = await User.findById(id);
    const allUserInDep = await User.find({department: department});
    if(userInDb.role === role){ 
        throw new Error('this user is already a QA coordinator')
    }
    else if(allUserInDep.filter(user => user.role === role).length >0) {
        await User.findOneAndUpdate({department: department, role: role}, {role: process.env.STAFF});
        await User.findByIdAndUpdate(id, {role: role});
    }
    else{
        await User.findByIdAndUpdate(id, {role: role});
    }
}

module.exports = {getAllUser, getUserByUsername, getUserById, assignStaff};