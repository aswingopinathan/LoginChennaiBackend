var db = require("../config/connection");
var collection = require("../config/collections");

module.exports = {
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        if (userData.Password === user.Password) {
          console.log("login success");
          response.user = user;
          response.status = true;
          resolve(response);
        } else {
          console.log("login failed");
          resolve({ status: false });
        }
      } else {
        console.log("user not found");
        resolve({ status: false });
      }
    });
  },
  addImage: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      console.log("userData.Email", userData.Email);
      console.log("userData.Images", userData.Images);
      let imageUpload = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { Email: userData.Email },
          { $set: { Images: userData.Images } }
        );
      if (imageUpload) {
        response.status = true;
        resolve(response);
      } else {
        console.log("upload failed");
        resolve({ status: false });
      }
    });
  },
};
