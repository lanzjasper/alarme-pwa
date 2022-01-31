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

    const loginJSON = JSON.parse(event.body);

    const checkUsername = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'SELECT * FROM `tbl_users` WHERE `user_username` = ? LIMIT 1',
          loginJSON.username,
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
      let usernameExists = await checkUsername();

      if (usernameExists.length > 0) {
        usernameExists = usernameExists[0];

        const userPassword = usernameExists.user_password;
        const isValidPassword = bcrypt.compareSync(
          loginJSON.password,
          userPassword
        );
        let response = { success: isValidPassword };

        if (isValidPassword) {
          delete usernameExists.user_password;

          response = { ...response, ...usernameExists };
        }

        return {
          statusCode: 200,
          body: JSON.stringify(response),
          headers: {
            'Content-Type': 'application/json'
          }
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    } catch (e) {
      console.log(e);
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
