import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [sideBarInstance, setSideBarInstance] = useState(null);

  useEffect(() => {
    var elems = document.querySelectorAll('.sidenav');
    // eslint-disable-next-line
    setSideBarInstance(M.Sidenav.init(elems, {})[0]);

    return () => {};
  }, [setSideBarInstance]);

  const logout = (e) => {
    console.log(sideBarInstance);
    e.preventDefault();
    sessionStorage.clear();
    sideBarInstance.close();
    navigate('/');
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper">
          <Link to="/home" className="brand-logo">
            AlarMe
          </Link>
          <a href="/" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">
            <li>
              <a href="/logout" onClick={logout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-demo">
        <li>
          <a href="/logout" onClick={logout}>
            Logout
          </a>
        </li>
      </ul>
      <div className="container">
        <div
          className="row"
          style={{
            paddingTop: 20
          }}
        >
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
