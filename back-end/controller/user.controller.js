const {getAllUser, getUserByUsername} = require ('../service/user.service.js');

const userController = {
    getAllUser: async (req, res) => {
        const user = await getAllUser();
        res.status(200).json(user);
    },
    searchUserByUsername: async (req, res) => {
        const username = req.body.username;

        const result = await getUserByUsername(username);
    
        res.status(200).json(result);
    }
}

module.exports = userController;