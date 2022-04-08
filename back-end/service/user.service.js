const User = require("../model/user");
const fs = require("fs");
const xlsx = require("node-xlsx");
const { register } = require("./auth.service");
const CryptoJS = require("crypto-js");

const getAllUser = async () => {
  const qaManager = await User.findOne({ role: process.env.QAMANAGER })
    .sort([["createdAt", "asc"]])
  const userDb = await User.find({ role: process.env.STAFF })
    .sort([["createdAt", "asc"]])

  return [qaManager, ...userDb];
};

const getUserByUsername = async (username) => {
   const qaManager = await User.findOne({
     role: process.env.QAMANAGER,
     fullname: new RegExp(username, "i"),
   });
  const listUserInDb = await User.find({role: process.env.STAFF, fullname: new RegExp(username, 'i')})
    .sort([["createdAt", "asc"]])
    if(qaManager) {
      return [qaManager, ...listUserInDb]
    }
    return listUserInDb;
};

const getUserByDepartment = async (department, username = '') => {
  const listUserInDb = await User.find({
    department: department,
    role: process.env.STAFF,
    fullname: new RegExp(username, 'i')
  }).sort([["createdAt", "asc"]]);
  const qaCoordinatorOfDepartment = await User.findOne({
    department: department,
    role: process.env.QACOORDINATOR,
    fullname: new RegExp(username, 'i')
  });
  if (qaCoordinatorOfDepartment) {
    return [qaCoordinatorOfDepartment, ...listUserInDb];
  } else {
    return listUserInDb;
  }
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, updateAccount) => {
  console.log("putt" + updateAccount);
  const {
    password,
    confirmPassword,
    fullname,
    dateOfBirth,
    address,
    age,
    gender,
  } = updateAccount;
  if (password !== confirmPassword) {
    throw new Error("Password and confirm password is not match");
  } else {
    try {
      var encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.ENCRYPT_KEY
      ).toString();

      await User.findByIdAndUpdate(id, {
        fullname: fullname,
        password: encryptedPassword,
        dateOfBirth: dateOfBirth,
        address: address,
        age: age,
        gender: gender,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });
        console.log(errors);

        throw new Error(errors);
      }
    }
  }
};

const deleteUser = async (id) => {
  await User.findByIdAndUpdate(id, { deleted: true });
};

const reactiveUser = async (id) => {
  await User.findByIdAndUpdate(id, {deleted: false});
}

const assignStaff = async (role, department, id) => {
  const userInDb = await User.findById(id);
  const allUserInDep = await User.find({ department: department });
  if (userInDb.role === role) {
    throw new Error("this user is already a QA coordinator");
  } else if (allUserInDep.filter((user) => user.role === role).length > 0) {
    await User.findOneAndUpdate(
      { department: department, role: role },
      { role: process.env.STAFF }
    );
    await User.findByIdAndUpdate(id, { role: role });
  } else {
    await User.findByIdAndUpdate(id, { role: role });
  }
};

const assignStaffToManager = async (role, department, id) => {
  const accountInDB = await User.findByIdAndUpdate(id);
  const allAccountInDep = await User.find({ role: role });
  if (accountInDB.role === role) {
    throw new Error("This user is already a QA Manager");
  } else if (allAccountInDep.filter((user) => user.role === role).length > 0) {
    await User.findOneAndUpdate(
      { department: "", role: role },
      { role: process.env.STAFF }
    );
    await User.findByIdAndUpdate(id, { role: role });
  } else {
    await User.findByIdAndUpdate(id, { role: role });
  }
};

const findStaffWithoutDepartment = async () => {
  const listUserInDb = await User.find({
    department: "",
    role: [process.env.STAFF, process.env.QAMANAGER],
  });
  return listUserInDb;
};

const excelDataExtractor = async (filename) => {
  const obj = xlsx.parse(__basedir + `/statics/excels/${filename}`);
  const { data } = obj[0];
  return data.map((item) => [
    { value: item[0] },
    { value: item[1] },
    { value: item[2] },
    { value: item[3] },
    { value: item[4] },
    { value: item[5] },
    {
      value: parseInt(item[6]) ? new Date(item[6]) : item[6],
    },
    { value: item[7] },
  ]);
};

const importDataFromExcelToDb = async (filename) => {
  const obj = xlsx.parse(__basedir + `/statics/excels/${filename}`);
  const { data } = obj[0];
  return data.slice(1).map((item, index) => ({
    fullname: item[0],
    username: item[1],
    email: item[1],
    password: item[2],
    confirmPassword: item[3],
    address: item[4],
    age: item[5],
    dateOfBirth: item[6],
    gender: item[7],
    role: process.env.STAFF,
  }));
};

const createUserByExcel = async (filename) => {
  const data = await importDataFromExcelToDb(filename);
  let array = data.map(async (user) => {
    try {
      const useObj = new User({ ...user });
      await useObj.save();
      return useObj;
    } catch (e) {
      console.log(e);
    }
  });
  await Promise.all(array);
  const url = __basedir + `/statics/excels/${filename}`;
  fs.unlinkSync(url);
};

const deleteExcel = async (filename) => {
  try {
    const url = __basedir + `/statics/excels/${filename}`;
    fs.unlinkSync(url);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllUser,
  getUserByUsername,
  getUserById,
  createUserByExcel,
  excelDataExtractor,
  deleteExcel,
  assignStaff,
  getUserByDepartment,
  findStaffWithoutDepartment,
  assignStaffToManager,
  updateUser,
  deleteUser,
  reactiveUser,
};
