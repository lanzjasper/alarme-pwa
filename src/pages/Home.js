import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from '../components/HomeNavigation';

const Home = () => {
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
          <div className="col s12">
            <div
              className="card-panel teal waves-effect waves-block waves-light"
              onClick={() => navigate('/call-emergency')}
            >
              <div style={styles.titleStyle} className="white-text">
                <span style={{ marginRight: 5 }}>Call for Emergency</span>
                <span className="material-icons" style={styles.iconStyle}>
                  error
                </span>
              </div>
            </div>
          </div>
          <div className="col s12">
            <div
              className="card-panel teal waves-effect waves-block waves-light"
              onClick={() => navigate('/report-incident')}
            >
              <div style={styles.titleStyle} className="white-text">
                <span style={{ marginRight: 5 }}>Report an Incident</span>
                <span className="material-icons" style={styles.iconStyle}>
                  report
                </span>
              </div>
            </div>
          </div>
          <div className="col s12">
            <div className="card-panel teal waves-effect waves-block waves-light">
              <div style={styles.titleStyle} className="white-text">
                <span style={{ marginRight: 5 }}>Updates and Announcement</span>
                <span className="material-icons" style={styles.iconStyle}>
                  campaign
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
