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

module.exports = {getAllUser, getUserByUsername, getUserById};