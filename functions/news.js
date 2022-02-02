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

    const getNews = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'SELECT * FROM tbl_news INNER JOIN tbl_admins ON tbl_news.admin_id = tbl_admins.admin_id ORDER BY news_create DESC',
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
      let news = await getNews();

      news = await Promise.all(
        news.map(async (_news) => {
          const getLikes = () => {
            return new Promise((resolve, reject) => {
              connection.query(
                'SELECT * FROM tbl_likes WHERE news_id = ?',
                _news.news_id,
                function (error, results) {
                  if (error) {
                    return reject(error);
                  }

                  return resolve(results);
                }
              );
            });
          };
          const getComments = () => {
            return new Promise((resolve, reject) => {
              connection.query(
                'SELECT * FROM tbl_comments INNER JOIN tbl_users ON tbl_comments.userid = tbl_users.userid WHERE news_id = ? ORDER BY date_commented DESC',
                _news.news_id,
                function (error, results) {
                  if (error) {
                    return reject(error);
                  }

                  return resolve(results);
                }
              );
            });
          };

          let likesData = await getLikes();
          let likesUserID = [];

          likesData = likesData.filter((v) => {
            likesUserID.push(v.userid);

            return likesUserID.filter((x) => x === v.userid).length === 1;
          });

          let commentsData = await getComments();

          _news.likesData = likesData;
          _news.commentsData = commentsData;

          return _news;
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: news
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    } catch (e) {
      console.log('e', e);
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
