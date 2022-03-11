const {getSubRouter} = require('../service/subRoute.service')
module.exports = {
    getAllSubRoute: async (req, res) => {
        try {
            const data = await getSubRouter();
            res.status(200).json({...data});
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
}