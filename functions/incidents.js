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

    const long = event.queryStringParameters.long;
    const lat = event.queryStringParameters.lat;
    const radiusInKilometer = event.queryStringParameters.radius_in_km;
    const radiusInMile = radiusInKilometer * 0.621371;

    const getNearbyIncidents = () => {
      return new Promise((resolve, reject) => {
        console.log(
          connection.query(
            'SELECT *, (3959 * acos (cos ( radians(?) ) * cos( radians( report_latitude ) ) * cos( radians( report_longitude ) - radians(?) ) + sin ( radians(?) ) * sin( radians( report_latitude ) ) ) ) AS distance FROM tbl_reports HAVING distance < ? ORDER BY report_datetime DESC',
            [lat, long, lat, radiusInMile],
            function (error, results) {
              console.log('');
              if (error) {
                return reject(error);
              }

              return resolve(results);
            }
          )
        );
      });
    };

    try {
      const nearbyIncidents = await getNearbyIncidents();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: nearbyIncidents
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
