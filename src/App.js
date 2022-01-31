import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const login = async () => {
    if (username.trim() === '' || password.trim() === '') return;

    setIsLoggingIn(true);

    try {
      const loginJSON = {
        username: username,
        password: password
      };
      const loginResult = await axios.post(
        '/.netlify/functions/login',
        loginJSON
      );

      if (loginResult.data.success) {
        // eslint-disable-next-line
        M.toast({ html: 'Login successful!', displayLength: 2000 });
      } else {
        // eslint-disable-next-line
        M.toast({
          html: 'Login failed! Invalid credentials!',
          displayLength: 2000
        });
      }

      setIsLoggingIn(false);
    } catch (e) {
      // eslint-disable-next-line
      M.toast({
        html: 'Login failed! Invalid credentials!',
        displayLength: 2000
      });
    }
  };
  const register = () => {
    navigate('/register');
  };
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      alert('Is supported!');
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('transitionend', handler);
  }, [setPromptInstall, setSupportsPWA]);

  const onClick = async () => {
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setPromptInstall(null);
    }
  };

  return (
    <>
      <nav>
        <div
          className="nav-wrapper"
          style={{
            marginLeft: 10
          }}
        >
          <Link to="/" className="brand-logo">
            AlarMe
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div
        style={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container">
          Supports PWA: {supportsPWA}
          <div className="row">
            <div className="col s12">
              <div className="input-field col s12">
                <input
                  id="username"
                  type="text"
                  className="validate"
                  onChange={(e) => {
                    setUsername(e.target.value.trim());
                  }}
                />
                <label htmlFor="username">Username</label>
              </div>
            </div>
            <div className="col s12">
              <div className="input-field col s12">
                <input
                  id="password"
                  type="password"
                  className="validate"
                  onChange={(e) => {
                    setPassword(e.target.value.trim());
                  }}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
            <div className="col s12">
              <div className="input-field col s12">
                <button
                  className={`waves-effect waves-light btn-large ${
                    isLoggingIn ? 'disabled' : ''
                  }`}
                  type="button"
                  onClick={() => login()}
                >
                  LOG IN
                </button>
              </div>
              <div className="input-field col s12">
                <button
                  className={`waves-effect waves-light btn-large`}
                  type="button"
                  onClick={() => register()}
                >
                  REGISTER
                </button>
              </div>
            </div>
            <div className="col s12">
              <button
                className="link-button"
                id="setup_button"
                aria-label="Install app"
                title="Install app"
                onClick={onClick}
              >
                Install App
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
