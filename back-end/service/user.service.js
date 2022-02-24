const User = require("../model/user");
const fs = require("fs");
const xlsx = require("node-xlsx");
const { register } = require("./auth.service");

const getAllUser = async () => {
  const qaManager = await User.findOne({ role: process.env.QAMANAGER }).sort([
    ["createdAt", "asc"],
  ]);
  const userDb = await User.find({ role: process.env.STAFF }).sort([
    ["createdAt", "asc"],
  ]);

  return [qaManager, ...userDb];
};

const getUserByUsername = async (username) => {
  const listUserInDb = await User.find().sort([["createdAt", "asc"]]);
  const dataFiltering = listUserInDb.filter((item) =>
    item.username.includes(username)
  );
  return dataFiltering;
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const readExcelData = async (filename) => {
  const obj = xlsx.parse(__basedir + `/statics/excels/${filename}`);
  const { data } = obj[0];
  const jsonData = [];
  const length = data.length;
  for (let i = 0; i < length; i++) {
    if (data[i][0] === undefined) {
      return jsonData;
    }
    jsonData.push([
      { value: data[i][0] },
      { value: data[i][1] },
      { value: data[i][2] },
      { value: data[i][3] },
      { value: data[i][4] },
      { value: data[i][5] },
      {
        value: parseInt(data[i][6]) ? new Date(data[i][6]) : data[i][6],
      },
      { value: data[i][7] },
    ]);
  }
  return jsonData;
};

const migrationToDb = async (filename) => {
  const obj = xlsx.parse(__basedir + `/statics/excels/${filename}`);
  const { data } = obj[0];
  const jsonData = [];
  const length = data.length;
  for (let i = 1; i < length; i++) {
    if (data[i][0] === undefined) {
      return jsonData;
    }
    jsonData.push([
      { value: data[i][0] },
      { value: data[i][1] },
      { value: data[i][2] },
      { value: data[i][3] },
      { value: data[i][4] },
      { value: data[i][5] },
      { value: new Date(data[i][6]) },
      { value: data[i][7] },
    ]);
  }
  return jsonData;
};

const createUserByExcel = async (filename) => {
  const data = await migrationToDb(filename);
  let array = data.map(async (user) => {
    try {
      User.findOne({ username: user[1].value }) && null;
      const useObj = new User({
        fullname: user[0].value,
        username: user[1].value,
        email: user[1].value,
        password: user[2].value,
        confirmPassword: user[3].value,
        address: user[4].value,
        age: user[5].value,
        dateOfBirth: user[6].value,
        gender: user[7].value,
        role: process.env.STAFF,
      });
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
  readExcelData,
  deleteExcel,
};
