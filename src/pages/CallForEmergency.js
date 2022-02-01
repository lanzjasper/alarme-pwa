import HomeNavigation from '../components/HomeNavigation';

const CallForEmergency = () => {
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
          <div
            className="card-panel teal waves-effect waves-block waves-light"
            onClick={() => {
              window.open('tel:72951669');
            }}
          >
            <div style={styles.titleStyle} className="white-text">
              Fire
              <span className="material-icons" style={styles.iconStyle}>
                fire_extinguisher
              </span>
            </div>
          </div>
          <div
            className="card-panel teal waves-effect waves-block waves-light"
            onClick={() => {
              window.open('tel:88824151');
            }}
          >
            <div style={styles.titleStyle} className="white-text">
              Traffic
              <span className="material-icons" style={styles.iconStyle}>
                traffic
              </span>
            </div>
          </div>
          <div
            className="card-panel teal waves-effect waves-block waves-light"
            onClick={() => {
              window.open('tel:911');
            }}
          >
            <div style={styles.titleStyle} className="white-text">
              Public Safety
              <span className="material-icons" style={styles.iconStyle}>
                health_and_safety
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallForEmergency;
