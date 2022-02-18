const User = require("../model/user");

const getAllUser = async () => {
    const qaManager = await User.findOne({roles: process.env.QAMANAGER}).sort([["createdAt", "asc"]]).exec();
    const userDb = await User.find({roles: process.env.STAFF}).sort([["createdAt", "asc"]]).exec();
    
    return [qaManager, ...userDb];
}

const getUserByUsername = async (username) => {
    return await User.find({username: username}).sort([["createdAt", "asc"]]).exec();
}

module.exports = {getAllUser, getUserByUsername};