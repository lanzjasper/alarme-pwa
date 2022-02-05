import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeNavigation from '../components/HomeNavigation';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [longLat, setLongLat] = useState(null);
  const [radiusInKilometer, setRadiusInKilometer] = useState(1);
  const [isGettingNotifications, setIsGettingNotifications] = useState(true);
  const emergencyIDMapping = {
    1: 'Fire',
    3: 'Traffic',
    4: 'Public Safety',
    2: 'Other Concerns'
  };

  useEffect(() => {
    const showPosition = (position) => {
      setLongLat({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      const longLatdata = {
        long: position.coords.longitude,
        lat: position.coords.latitude,
        radius_in_km: parseInt(radiusInKilometer)
      };

      setIsGettingNotifications(true);
      axios
        .get('/.netlify/functions/incidents', {
          params: longLatdata
        })
        .then((res) => {
          if (res.data.success) {
            setIsGettingNotifications(false);
            setNotifications(res.data.data);
          }
        });
    };
    const locationError = () => {
      setIsGettingNotifications(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, locationError);
    } else {
      console.log('Geo Location not supported by browser');
    }

    return () => {};
  }, [radiusInKilometer]);

  return (
    <>
      <HomeNavigation />
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h5>Incidents Near You</h5>
            <span>Incidents within {radiusInKilometer} kilometer.</span>
            <p className="range-field">
              <input
                type="range"
                id="test5"
                min="1"
                max="10"
                value={radiusInKilometer}
                onChange={(e) => setRadiusInKilometer(parseInt(e.target.value))}
              />
            </p>
          </div>
        </div>
        {isGettingNotifications && (
          <div className="col s12">
            <div className="center-loader-container">
              <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-blue-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div>
                  <div className="gap-patch">
                    <div className="circle"></div>
                  </div>
                  <div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!isGettingNotifications &&
          longLat &&
          notifications.map((notification) => {
            return (
              <div className="row">
                <div className="col s12">
                  <div className="card alarme-background">
                    <div className="card-content white-text">
                      <span className="card-title">
                        {emergencyIDMapping[notification.emergency_id]}
                      </span>
                      <p>{notification.report_description}</p>
                      {notification.report_multimedia ? (
                        <img
                          className="responsive-img"
                          src={notification.report_multimedia}
                          alt="Incident"
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="card-action">
                      <a href="#">Rate</a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {!longLat && (
          <div className="row">
            <div className="col s12">
              <h4 style={{ textAlign: 'center' }}>Location access needed!</h4>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
