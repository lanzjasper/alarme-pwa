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

    const commentJSON = JSON.parse(event.body);

    const insertComment = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO tbl_comments SET ?',
          commentJSON,
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
      await insertComment();

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
  } else if (event.httpMethod === 'GET') {
    const mysql = require('mysql');
    const connection = await mysql.createConnection({
      host: '34.124.154.244',
      user: 'root',
      password: 'admin123',
      database: 'dbalert'
    });

    connection.connect();

    const newsID = event.queryStringParameters.newsID;

    const getComments = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'SELECT * FROM tbl_comments INNER JOIN tbl_users ON tbl_comments.userid = tbl_users.userid WHERE news_id = ? ORDER BY date_commented ASC',
          newsID,
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
      const comments = await getComments();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: comments
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
