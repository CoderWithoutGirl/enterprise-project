const db = {};
const mongoose = require('mongoose');
const User = require('../model/user');

mongoose.Promise = global.Promise;

db.mongoose = mongoose;

db.seedData = async () => {
    try {
        const userInDbCount = await User.estimatedDocumentCount();
        if(!userInDbCount) {
            const admin = new User({
                username: 'admin',
                password: 'admin@123',
                fullname: "Administrator",
                dateOfBirth: new Date(),
                age: 21,
                gender: 'male',
                roles: process.env.ADMIN
            });
            await admin.save();
            const userTest1 = new new User({
              username: "usertest1",
              password: "abc123",
              fullname: "user test 1",
              dateOfBirth: new Date(),
              age: 21,
              gender: "male",
              roles: process.env.STAFF,
            });
            await userTest1.save();
            const userTest2 = new new User({
              username: "usertest2",
              password: "abc123",
              fullname: "user test 2",
              dateOfBirth: new Date(),
              age: 21,
              gender: "male",
              roles: process.env.STAFF,
            });
            await userTest2.save();
            const userTest3 = new new User({
              username: "usertest3",
              password: "abc123",
              fullname: "user test 3",
              dateOfBirth: new Date(),
              age: 21,
              gender: "male",
              roles: process.env.STAFF,
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
        await mongoose.connect(dbConnectionUrl, {useUnifiedTopology: true, useNewUrlParser: true});
        await db.seedData();
        console.log('DB connected');
    } catch (error) {
       console.error(`Connecting error: ${error}`);
    }
}

module.exports = db;
