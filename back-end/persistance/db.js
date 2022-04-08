const db = {};
const mongoose = require('mongoose');
const User = require('../model/user');
const Department = require('../model/department');

mongoose.Promise = global.Promise;

db.mongoose = mongoose;

db.seedData = async () => {
    try {
        const departmentCount = await Department.estimatedDocumentCount();
        if(!departmentCount) {
            const itMajor = new Department({name: "IT Major", description: "For IT Staff"})
            const bizMajor = new Department({name: "Business Major", description: "For Business Staff"})
            const gdMajor = new Department({name: "Graphic Design Major", description: "For Graphic Design Staff"})
            await itMajor.save();
            await bizMajor.save();
            await gdMajor.save();
        }
        
        const userInDbCount = await User.estimatedDocumentCount();
        if (!userInDbCount) {
            const admin = new User({
                username: 'admin',
                password: 'admin@123',
                fullname: "Administrator",
                dateOfBirth: new Date(),
                email: "admin123@gmail.com",
                age: 21,
                gender: 'Male',
                role: process.env.ADMIN
            });
            await admin.save();
            const userTest1 = await new User({
              username: "mxnghia49@gmail.com",
              password: "Darkraiser49@",
              fullname: "Application QA Manager",
              email: "mxnghia49@gmail.com",
              dateOfBirth: new Date(),
              age: 21,
              gender: "Male",
              role: process.env.QAMANAGER,
            });
            await userTest1.save();
            const userTest2 = await new User({
              username: "nghiamxgcd18432@fpt.edu.vn",
              password: "Darkraiser49@",
              fullname: "user test 2",
              email: "nghiamxgcd18432@fpt.edu.vn",
              dateOfBirth: new Date(),
              age: 21,
              gender: "Male",
              department: "IT Major",
              role: process.env.QACOORDINATOR,
            });
            await userTest2.save();
            const userTest3 = await new User({
              username: "usertest3@gmail.com",
              password: "abc123",
              fullname: "user test 3",
              email: "user3@gmail.com",
              dateOfBirth: new Date(),
              age: 21,
              gender: "Male",
              department: "IT Major",
              role: process.env.STAFF,
            });
            await userTest3.save();
            console.log("Account seeded");
        }

    } catch (error) {
        console.error(error)
    }
}



db.connect = async (dbConnectionUrl) => {
    try {
        await mongoose.connect(dbConnectionUrl, { useUnifiedTopology: true, useNewUrlParser: true });
        await db.seedData();
        console.log('DB connected');
    } catch (error) {
        console.error(`Connecting error: ${error}`);
    }
}

module.exports = db;
