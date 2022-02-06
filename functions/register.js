const bcrypt = require('bcrypt');

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    const mysql = require('mysql');
    const connection = await mysql.createConnection({
      host: '34.124.154.244',
      user: 'root',
      password: 'admin123',
      database: 'dbalert'
    });

    connection.connect();

    const registerDataFromJSON = JSON.parse(event.body);
    const userRegisterData = {
      user_username: registerDataFromJSON['user_username'],
      user_email: registerDataFromJSON['user_email'],
      user_password: registerDataFromJSON['user_password'],
      user_fname: registerDataFromJSON['user_fname'],
      user_mname: registerDataFromJSON['user_mname'],
      user_lname: registerDataFromJSON['user_lname'],
      user_mobile: registerDataFromJSON['user_mobile'],
      user_address: registerDataFromJSON['user_address'],
      user_photo: registerDataFromJSON['user_photo'],
      user_suffix: '',
      user_sex: registerDataFromJSON['user_sex'],
      user_telephone: registerDataFromJSON['user_telephone'],
      user_vaccinated: '',
      user_vtype: '',
      user_vdose: '',
      issent_passcode: 0,
      user_status: registerDataFromJSON['user_photo']
        ? 'verified'
        : 'unverified'
    };

    const checkUsername = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'SELECT `user_username` FROM `tbl_users` WHERE `user_username` = ?',
          userRegisterData.user_username,
          function (error, results) {
            if (error) {
              return reject(error);
            }

            return resolve(results);
          }
        );
      });
    };

    try {
      const usernameExists = await checkUsername();

      if (usernameExists.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: false,
            error: 'Username already exists!'
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        };
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error occurred!',
          success: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }

    const checkEmail = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'SELECT `user_email` FROM `tbl_users` WHERE `user_email` = ?',
          userRegisterData.user_email,
          function (error, results) {
            if (error) {
              return reject(error);
            }

            return resolve(results);
          }
        );
      });
    };

    try {
      const emailExists = await checkEmail();

      if (emailExists.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            error: 'Email already exists!'
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        };
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error occurred!',
          success: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }

    const registerPromise = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO tbl_users SET ?',
          userRegisterData,
          function (error, results) {
            if (error) {
              return reject(error);
            }

            return resolve(results);
          }
        );
      });
    };

    const hash = bcrypt.hashSync(userRegisterData.user_password, 10);

    userRegisterData.user_password = hash;

    try {
      const registerResult = await registerPromise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          userID: registerResult.insertId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error occurred!',
          success: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
  }

  return {
    statusCode: 405
  };
};
