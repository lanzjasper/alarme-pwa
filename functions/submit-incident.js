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

    const incidentJSON = JSON.parse(event.body);
    const reportData = {
      userid: incidentJSON['userid'],
      emergency_id: incidentJSON['emergency_id'],
      subreport_id: incidentJSON['subreport_id'],
      report_description: incidentJSON['report_description'],
      report_multimedia: incidentJSON['report_multimedia']
        ? incidentJSON['report_multimedia']
        : '',
      report_status: incidentJSON['report_status'],
      report_longitude: incidentJSON['longLat'].lng,
      report_latitude: incidentJSON['longLat'].lat,
      report_turnaroundtime: ''
    };

    const insertReportPromise = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO tbl_reports SET ?',
          reportData,
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
      const insertReportResult = await insertReportPromise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          reportID: insertReportResult.insertId
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
  } else if (event.httpMethod === 'PATCH' || event.httpMethod === 'PUT') {
    const mysql = require('mysql');
    const connection = await mysql.createConnection({
      host: '34.124.154.244',
      user: 'root',
      password: 'admin123',
      database: 'dbalert'
    });

    connection.connect();

    const incidentJSON = JSON.parse(event.body);
    let reportData = {};

    if ('report_status' in incidentJSON) {
      reportData.report_status = incidentJSON['report_status'];
    }

    if ('report_status_after_submit' in incidentJSON) {
      reportData.report_status_after_submit =
        incidentJSON['report_status_after_submit'];
    }

    const updateReportPromise = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          'UPDATE tbl_reports SET ? WHERE report_id = ?',
          [reportData, incidentJSON.report_id],
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
      const updateReportResult = await updateReportPromise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: updateReportResult.changedRows > 0
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
