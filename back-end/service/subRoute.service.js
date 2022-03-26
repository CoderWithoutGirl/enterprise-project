const Department = require('../model/department');
const Category = require('../model/category');

const getSubRouter = async () => {
    const departmentRouters = await Department.find({deleted: false});
    const categoryRouters = await Category.find();
    return {departmentRouters: departmentRouters.map(item => ({
        name: item.name
    })), categoryRouters: categoryRouters.map(item => ({
        name: item.name
    }))}
}

module.exports = {getSubRouter}
