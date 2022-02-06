import HomeNavigation from '../components/HomeNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const UpdateIncidentCategory = () => {
  const { state } = useLocation();
  const [category, setCategory] = useState(
    state.notificationData.report_status || 5
  );
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
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
  const update = () => {
    setCategory(true);
    axios
      .put('/.netlify/functions/submit-incident', {
        report_status: category,
        report_id: state.notificationData.report_id
      })
      .then((res) => {
        setIsUpdating(true);

        if (res.data.success) {
          // eslint-disable-next-line
          M.toast({ html: 'Update success!', displayLength: 2000 });

          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          setIsUpdating(false);
          // eslint-disable-next-line
          M.toast({ html: 'Update failed!', displayLength: 2000 });
        }
      })
      .catch((e) => {
        setIsUpdating(false);
        // eslint-disable-next-line
        M.toast({ html: 'Update failed!', displayLength: 2000 });
      });
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
              className={`btn btn-large waves-effect waves-light ${
                isUpdating ? 'disabled' : ''
              }`}
              type="button"
              style={{ width: '100%' }}
              onClick={() => update()}
            >
              Update
              <i className="material-icons right">send</i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateIncidentCategory;
