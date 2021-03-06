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

    const likeJSON = JSON.parse(event.body);
    likeJSON.admin_id = -1;

    const insertLike = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO tbl_likes SET ?',
          likeJSON,
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
      await insertLike();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true
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
  } else if (event.httpMethod === 'DELETE') {
    const mysql = require('mysql');
    const connection = await mysql.createConnection({
      host: '34.124.154.244',
      user: 'root',
      password: 'admin123',
      database: 'dbalert'
    });

    connection.connect();

    const likeJSON = JSON.parse(event.body);

    const deleteLikes = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'DELETE FROM tbl_likes WHERE userid = ? and news_id = ?',
          [likeJSON.userid, likeJSON.news_id],
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
      await deleteLikes();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true
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
