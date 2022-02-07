import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeNavigation from '../components/HomeNavigation';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [longLat, setLongLat] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [radiusInKilometer, setRadiusInKilometer] = useState(1);
  const [isGettingNotifications, setIsGettingNotifications] = useState(false);
  const [isGettingMoreNotifications, setIsGettingMoreNotifications] =
    useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const emergencyIDMapping = {
    1: 'Fire',
    3: 'Traffic',
    4: 'Public Safety',
    2: 'Other Concerns'
  };
  const categoryMapping = {
    5: 'Less urgent incidents.',
    4: 'Potential serious condition, situational urgency complex case, resident distress, or potential complication.',
    3: 'Potential life threatening , situational urgency, or severe pain that requires emergency intervention.',
    2: 'Imminently life threatening incidents, time sensitive treatment needed, or severe pain.',
    1: 'Life threatening conditions.'
  };
  const categoryTitleMapping = {
    5: 'Minor',
    4: 'Significant',
    3: 'Serious',
    2: 'Major',
    1: 'Fatal'
  };

  const getMoreNotifications = () => {
    setIsGettingMoreNotifications(true);

    const params = {
      long: longLat.lng,
      lat: longLat.lat,
      radius_in_km: parseInt(radiusInKilometer),
      page: currentPage
    };

    axios
      .get('/.netlify/functions/incidents', {
        params: params
      })
      .then(async (res) => {
        if (res.data.success) {
          let _notifications = res.data.data;

          _notifications = await Promise.all(
            _notifications.map(async (notification) => {
              const coordinatesToNameAPI = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${notification.report_latitude}&lon=${notification.report_longitude}&zoom=18&addressdetails=1`;

              const coordinatesToName = await axios.get(coordinatesToNameAPI);

              notification.where = coordinatesToName.data.display_name;

              return notification;
            })
          );

          if (_notifications.length === 0) {
            setHasMoreData(false);
          }

          setNotifications([...notifications, ..._notifications]);
          setCurrentPage(currentPage + 1);
        }

        setIsGettingMoreNotifications(false);
      });
  };

  useEffect(() => {
    const showPosition = (position) => {
      setLongLat({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      const params = {
        long: position.coords.longitude,
        lat: position.coords.latitude,
        radius_in_km: 1,
        page: 1
      };
      setIsGettingNotifications(true);

      axios
        .get('/.netlify/functions/incidents', {
          params: params
        })
        .then(async (res) => {
          if (res.data.success) {
            let _notifications = res.data.data;

            _notifications = await Promise.all(
              _notifications.map(async (notification) => {
                const coordinatesToNameAPI = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${notification.report_latitude}&lon=${notification.report_longitude}&zoom=18&addressdetails=1`;

                const coordinatesToName = await axios.get(coordinatesToNameAPI);

                notification.where = coordinatesToName.data.display_name;

                return notification;
              })
            );

            if (_notifications.length === 0) {
              setHasMoreData(false);
            }

            setNotifications(_notifications);
            setCurrentPage(2);
          }

          setIsGettingNotifications(false);
        });
    };
    const locationError = () => {
      setIsGettingNotifications(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, locationError);
    }

    return () => {};
  }, []);
  const openModal = (e, notificationData) => {
    e.preventDefault();

    navigate('/update-incident', {
      state: {
        notificationData: notificationData
      }
    });
  };

  useEffect(() => {
    console.log('notifications', notifications);
  }, [notifications]);

  return (
    <div id="scrollableDiv" style={{ height: '100vh', overflow: 'auto' }}>
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
        {!longLat && (
          <div className="row">
            <div className="col s12">
              <h4 style={{ textAlign: 'center' }}>Location access needed!</h4>
            </div>
          </div>
        )}
        <div className="container-fluid">
          {isGettingNotifications && (
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
          )}
          {longLat &&
            notifications.map((notification) => {
              return (
                <div className="col s12" key={notification.report_id}>
                  <div className="card alarme-background">
                    <div className="card-content white-text">
                      <span className="card-title">
                        {emergencyIDMapping[notification.emergency_id]}
                      </span>
                      <p>
                        Category {notification.report_status} -{' '}
                        {
                          categoryTitleMapping[
                            parseInt(notification.report_status)
                          ]
                        }
                      </p>
                      <p>
                        {categoryMapping[parseInt(notification.report_status)]}
                      </p>
                      <br></br>
                      <p>{notification.where}</p>
                      <br></br>
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
                      <p>{notification.report_datetime}</p>
                      <p>Report ID: {notification.report_id}</p>
                    </div>
                    <div className="card-action">
                      {/* eslint-disable-next-line */}
                      <a
                        href="#"
                        className="white-text"
                        onClick={(e) => openModal(e, notification)}
                      >
                        Rate Category
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          {isGettingMoreNotifications && !isGettingNotifications && (
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
          )}
          {hasMoreData && notifications.length !== 0 && (
            <div
              style={{ paddingBottom: 20, paddingTop: 20, textAlign: 'center' }}
            >
              <button
                className={`waves-effect btn alarme-background ${
                  isGettingMoreNotifications ? 'disabled' : ''
                }`}
                onClick={getMoreNotifications}
                type="button"
              >
                Load More
              </button>
            </div>
          )}
          {!hasMoreData && (
            <div
              style={{
                textAlign: 'center',
                paddingBottom: 20,
                fontWeight: 500
              }}
            >
              No more data to load
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
