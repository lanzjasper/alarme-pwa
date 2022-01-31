exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const mysql = require('mysql');
    const connection = await mysql.createConnection({
      host: '34.124.154.244',
      user: 'root',
      password: 'admin123',
      database: 'dbalert'
    });

    connection.connect();

    const email = event.queryStringParameters.email;

    const checkEmail = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'SELECT `user_email` FROM `tbl_users` WHERE `user_email` = ?',
          email,
          function (error, results, fields) {
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

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          existing: emailExists.length > 0
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
