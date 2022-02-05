import HomeNavigation from '../components/HomeNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const RiskRating = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [category, setCategory] = useState(state.report_status || 5);
  const submitAll = async () => {
    const emergencyIDMapping = {
      Fire: 1,
      Traffic: 3,
      'Public Safety': 4,
      'Other Concerns': 2
    };
    navigate('/report-summary', {
      state: {
        userid: sessionStorage.getItem('userid'),
        emergency_id: emergencyIDMapping[state.selectedIncident],
        subreport_id: state.subreport_id,
        report_description: state.report_description,
        report_multimedia: state.attachmentURL,
        report_status: category,
        selectedIncident: state.selectedIncident,
        longLat: state.longLat
      }
    });
  };

  const categories = [
    {
      name: 'Category 5 - Minor',
      note: 'Less urgent incidents.',
      textColor: 'blue-text',
      value: 5
    },
    {
      name: 'Category 4 - Significant',
      note: 'Potential serious condition, situational urgency complex case, resident distress, or potential complication.',
      textColor: 'green-text',
      value: 4
    },
    {
      name: 'Category 3 - Serious',
      note: 'Potential life threatening , situational urgency, or severe pain that requires emergency intervention.',
      textColor: 'yellow-text',
      value: 3
    },
    {
      name: 'Category 2 - Major',
      note: 'Imminently life threatening incidents, time sensitive treatment needed, or severe pain.',
      textColor: 'orange-text',
      value: 2
    },
    {
      name: 'Category 1 - Fatal',
      note: 'Life threatening conditions.',
      textColor: 'red-text',
      value: 1
    }
  ];

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
          {categories.map((_category) => {
            return (
              <div key={_category.name}>
                <div className="col s12">
                  <p>
                    <label>
                      <input
                        className="with-gap"
                        name="category"
                        type="radio"
                        value={_category.value}
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
                        defaultChecked={
                          parseInt(category, 10) === _category.value
                        }
                      />
                      <span className={`${_category.textColor}`}>
                        {_category.name}
                      </span>
                    </label>
                  </p>
                </div>
                <div className="col s12" style={{ paddingLeft: 45 }}>
                  {_category.note}
                </div>
              </div>
            );
          })}
          <div className="col s12" style={{ paddingTop: 20 }}>
            <button
              className={`btn btn-large waves-effect waves-light`}
              type="button"
              style={{ width: '100%' }}
              onClick={() => submitAll()}
            >
              Submit
              <i className="material-icons right">send</i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RiskRating;
