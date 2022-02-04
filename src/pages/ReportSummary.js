import HomeNavigation from '../components/HomeNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const ReportSummary = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const styles = {
    titleStyle: {
      fontWeight: 700,
      paddingTop: 10,
      paddingBottom: 10
    },
    contentStyle: {
      fontSize: 18
    },
    editButton: {
      float: 'right',
      lineHeight: '24px'
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitAll = async () => {
    try {
      setIsSubmitting(true);
      const reportJSON = {
        userid: sessionStorage.getItem('userid'),
        emergency_id: state.emergency_id,
        subreport_id: state.subreport_id,
        report_description: state.report_description,
        report_multimedia: state.report_multimedia,
        report_status: state.report_status,
        longLat: state.longLat
      };
      const response = await axios.post(
        '/.netlify/functions/submit-incident',
        reportJSON
      );
      if (response.data.success) {
        // eslint-disable-next-line
        M.toast({
          html: 'Submit report success!',
          displayLength: 3000
        });
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      } else {
        // eslint-disable-next-line
        M.toast({
          html: 'Submit report failed!',
          displayLength: 2000
        });
      }
      setIsSubmitting(false);
    } catch (e) {
      setIsSubmitting(false);
      // eslint-disable-next-line
      M.toast({
        html: 'Submit report failed!',
        displayLength: 2000
      });
    }
  };
  const categoryMapping = {
    5: 'Category 5 - Minor',
    4: 'Category 4 - Significant',
    3: 'Category 3 - Serious',
    2: 'Category 2 - Major',
    1: 'Category 1 - Fatal'
  };
  const reportSubMapping = {
    1: 'Smoke',
    2: 'Malfunctioning Electrical Outlets',
    3: 'Flammable Liquid',
    4: 'Hot Work',
    5: 'Equipment Machinery',
    6: 'Others',
    7: 'Illegal Parking',
    8: 'Road Rage',
    9: 'Potholes',
    10: 'Broken Pipes',
    11: 'Others',
    12: 'Construction Issues',
    13: 'Garbage & Littering',
    14: 'Overgrown Trees',
    15: 'Sewage Problem',
    16: 'Crime',
    17: 'Others',
    18: 'Others'
  };
  const editCategory = () => {
    navigate('/risk-rating', {
      state: {
        selectedIncident: state.selectedIncident,
        subreport_id: state.subreport_id,
        report_description: state.report_description,
        report_status: state.report_status
      }
    });
  };
  const editIncidentDetails = () => {
    navigate('/incident-details', {
      state: {
        selectedIncident: state.selectedIncident,
        subreport_id: state.subreport_id,
        report_description: state.report_description,
        report_status: state.report_status,
        report_multimedia: state.report_multimedia,
        operation: 'update'
      }
    });
  };

  return (
    <>
      <HomeNavigation></HomeNavigation>
      <div className="container">
        <div
          className="row"
          style={{
            paddingTop: 20
          }}
        >
          <div className="row">
            <div className="col s12">
              <div className="card">
                <div className="card-content">
                  <span className="card-title" style={styles.titleStyle}>
                    Report Category
                    <button
                      className="waves-effect waves-teal btn-flat"
                      type="button"
                      style={styles.editButton}
                      onClick={() => editIncidentDetails()}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                  </span>
                  <p style={styles.contentStyle}>
                    {reportSubMapping[state.subreport_id]}
                  </p>
                  <span className="card-title" style={styles.titleStyle}>
                    Report Description
                    <button
                      className="waves-effect waves-teal btn-flat"
                      type="button"
                      style={styles.editButton}
                      onClick={() => editIncidentDetails()}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                  </span>
                  <p style={styles.contentStyle}>{state.report_description}</p>
                  {state.report_multimedia && (
                    <>
                      <span className="card-title" style={styles.titleStyle}>
                        Image
                        <button
                          className="waves-effect waves-teal btn-flat"
                          type="button"
                          style={styles.editButton}
                          onClick={() => editIncidentDetails()}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                      </span>
                      <p>
                        <img
                          className="responsive-img"
                          src={state.report_multimedia}
                          alt="Report"
                        />
                      </p>
                    </>
                  )}
                  <span className="card-title" style={styles.titleStyle}>
                    Risk Rate
                    <button
                      className="waves-effect waves-teal btn-flat"
                      type="button"
                      style={styles.editButton}
                      onClick={() => editCategory()}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                  </span>
                  <p style={styles.contentStyle}>
                    {categoryMapping[state.report_status]}
                  </p>
                </div>
              </div>
            </div>
            <div className="col s12" style={{ paddingTop: 20 }}>
              <button
                className={`btn btn-large waves-effect waves-light ${
                  isSubmitting ? 'disabled' : ''
                }`}
                type="button"
                style={{ width: '100%' }}
                onClick={() => submitAll()}
              >
                Submit
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportSummary;
