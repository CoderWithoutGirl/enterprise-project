const {getAllUser, getUserByUsername, getUserById} = require ('../service/user.service.js');

const userController = {
    getAllUser: async (req, res) => {
        const username = req.query.username;
        if(username){
            const result = await getUserByUsername(username);
            res.status(200).json(result);
        }
        else{
            const user = await getAllUser();
            res.status(200).json(user);
        }
    },
    getUserById: async (req, res) => {
        const id = req.params.id;
        const result = await getUserById(id);
        res.status(200).json(result);
    }
}

module.exports = userController;