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

    const mobileNumber = event.queryStringParameters.contact_no;

    const checkMobileNumber = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'SELECT `user_mobile` FROM `tbl_users` WHERE `user_mobile` = ?',
          mobileNumber,
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
      const mobileNumberExists = await checkMobileNumber();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          existing: mobileNumberExists.length > 0
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
