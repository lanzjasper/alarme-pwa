import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const HomeNavigation = () => {
  const navigate = useNavigate();
  const [sideBarInstance, setSideBarInstance] = useState(null);

  useEffect(() => {
    var elems = document.querySelectorAll('.sidenav');
    // eslint-disable-next-line
    setSideBarInstance(M.Sidenav.init(elems, {})[0]);

    return () => {};
  }, [setSideBarInstance]);

  const logout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    sideBarInstance.close();
    navigate('/', {
      replace: true
    });
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper alarme-background">
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
    </>
  );
};

export default HomeNavigation;
