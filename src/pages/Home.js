import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from '../components/HomeNavigation';

const Home = () => {
  const navigate = useNavigate();

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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
                className="white-text"
              >
                Call for Emergency
                <i className="medium material-icons right">error_outline</i>
              </div>
            </div>
          </div>
          <div className="col s12">
            <div className="card-panel teal waves-effect waves-block waves-light">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
                className="white-text"
              >
                Report an Incident
                <i className="medium material-icons right">send</i>
              </div>
            </div>
          </div>
          <div className="col s12">
            <div className="card-panel teal waves-effect waves-block waves-light">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
                className="white-text"
              >
                Updates and Announcement
                <i className="medium material-icons right">announcement</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
