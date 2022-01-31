import HomeNavigation from '../components/HomeNavigation';

const CallForEmergency = () => {
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
              window.open('tel:911');
            }}
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
              Fire
              <i className="medium material-icons right">smoking_rooms</i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallForEmergency;
