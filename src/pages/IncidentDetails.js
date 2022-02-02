import HomeNavigation from '../components/HomeNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncidentDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const radioValue = {
    Fire: [
      { name: 'Smoke', id: 1 },
      { name: 'Malfunctioning Electrical Outlets', id: 2 },
      { name: 'Flammable Liquid', id: 3 },
      { name: 'Hot Work', id: 4 },
      { name: 'Equipment Machinery', id: 5 },
      { name: 'Others', id: 6 }
    ],
    Traffic: [
      { name: 'Illegal Parking', id: 7 },
      { name: 'Road Rage', id: 8 },
      { name: 'Potholes', id: 9 },
      { name: 'Broken Pipes', id: 10 },
      { name: 'Others', id: 11 }
    ],
    'Public Safety': [
      { name: 'Construction Issues', id: 12 },
      { name: 'Garbage & Littering', id: 13 },
      { name: 'Overgrown Trees', id: 14 },
      { name: 'Sewage Problem', id: 15 },
      { name: 'Crime', id: 16 },
      { name: 'Others', id: 17 }
    ],
    'Other Concerns': [{ name: 'Others', id: 18 }]
  };
  let initialSubreportValueIndex = null;

  if (state.subreport_id) {
    for (let value of Object.values(radioValue)) {
      initialSubreportValueIndex = value.findIndex(
        (v) => v.id === parseInt(state.subreport_id)
      );

      if (initialSubreportValueIndex !== -1) {
        break;
      }
    }
  }

  const [reportName, setReportName] = useState(
    radioValue[state.selectedIncident][initialSubreportValueIndex || 0].id
  );
  const [comment, setComment] = useState(state.report_description || '');
  const [attachmentURL, setAttachmentURL] = useState(
    state.report_multimedia || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const goToRiskRating = () => {
    if (state.operation === 'update') {
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
          subreport_id: reportName,
          report_description: comment,
          report_multimedia: attachmentURL,
          report_status: state.report_status,
          selectedIncident: state.selectedIncident
        }
      });
    } else {
      navigate('/risk-rating', {
        state: {
          selectedIncident: state.selectedIncident,
          subreport_id: reportName,
          report_description: comment,
          attachmentURL: attachmentURL
        }
      });
    }
  };
  const uploadImage = (fileAttachment) => {
    let formData = new FormData();

    formData.append('upload_preset', 'zyasxaqc');
    formData.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    formData.append('file', fileAttachment);

    setIsUploading(true);

    axios
      .post(`https://api.cloudinary.com/v1_1/alarme/upload`, formData)
      .then((res) => {
        setAttachmentURL(res.data.secure_url);
        setIsUploading(false);
      })
      .catch(() => {
        setIsUploading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line
    M.updateTextFields();
  }, []);

  const determineCheckedRadio = (currentValueID, index) => {
    if (state.subreport_id) {
      return currentValueID === parseInt(state.subreport_id);
    }

    return index === 0;
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
          <div>
            <h4>{state.selectedIncident}</h4>
            <h6>Reports involving {state.selectedIncident}</h6>
            <div>
              {radioValue[state.selectedIncident].map((value, i) => {
                return (
                  <p key={value.id}>
                    <label>
                      <input
                        className="with-gap"
                        name="report_name"
                        type="radio"
                        value={value.id}
                        onChange={(e) => {
                          setReportName(e.target.value);
                        }}
                        defaultChecked={determineCheckedRadio(value.id, i)}
                      />
                      <span>{value.name}</span>
                    </label>
                  </p>
                );
              })}
            </div>
            <div className="row">
              <div className="input-field col s12">
                <textarea
                  id="comment"
                  className="materialize-textarea"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  value={comment}
                ></textarea>
                <label htmlFor="comment">Comments</label>
              </div>
            </div>
            <div className="file-field input-field">
              <div className="btn">
                <span>Attachments</span>
                <input
                  type="file"
                  onChange={(e) => {
                    uploadImage(e.target.files[0]);
                  }}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            <button
              className={`btn btn-large waves-effect waves-light ${
                isUploading ? 'disabled' : ''
              }`}
              type="button"
              style={{ width: '100%' }}
              onClick={() => goToRiskRating()}
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

export default IncidentDetails;