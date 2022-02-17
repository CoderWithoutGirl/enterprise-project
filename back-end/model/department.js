const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 200
    },
},
    { timestamps: true }
);

const DepartmentModel = mongoose.model("Department", departmentSchema);

module.exports = DepartmentModel;