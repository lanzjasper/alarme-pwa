import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from '../components/HomeNavigation';

const ReportIncident = () => {
  const navigate = useNavigate();
  const styles = {
    titleStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 30,
      fontWeight: 700
    },
    iconStyle: {
      fontSize: 40
    }
  };
  const fillUpIncidentDetails = (selectedIncident) => {
    navigate('/incident-details', {
      state: {
        selectedIncident: selectedIncident
      }
    });
  };

  return (
    <>
      <HomeNavigation />
      <div className="container">
        <div
          className="row"
          style={{
            paddingTop: 20
          }}
        >
          <div
            className="card-panel teal waves-effect waves-block waves-light"
            onClick={() => {
              fillUpIncidentDetails('Fire');
            }}
          >
            <div style={styles.titleStyle} className="white-text">
              <span style={{ marginRight: 5 }}>Fire</span>
              <span className="material-icons" style={styles.iconStyle}>
                fire_extinguisher
              </span>
            </div>
          </div>
          <div
            className="card-panel teal waves-effect waves-block waves-light"
            onClick={() => {
              fillUpIncidentDetails('Traffic');
            }}
          >
            <div style={styles.titleStyle} className="white-text">
              <span style={{ marginRight: 5 }}>Traffic</span>
              <span className="material-icons" style={styles.iconStyle}>
                traffic
              </span>
            </div>
          </div>
          <div
            className="card-panel teal waves-effect waves-block waves-light"
            onClick={() => {
              fillUpIncidentDetails('Public Safety');
            }}
          >
            <div style={styles.titleStyle} className="white-text">
              <span style={{ marginRight: 5 }}>Public Safety</span>
              <span className="material-icons" style={styles.iconStyle}>
                health_and_safety
              </span>
            </div>
          </div>
          <div
            className="card-panel teal waves-effect waves-block waves-light"
            onClick={() => {
              fillUpIncidentDetails('Other Concerns');
            }}
          >
            <div style={styles.titleStyle} className="white-text">
              <span style={{ marginRight: 5 }}>Other Concerns</span>
              <span className="material-icons" style={styles.iconStyle}>
                sentiment_very_dissatisfied
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportIncident;
