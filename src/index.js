import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import CallForEmergency from './pages/CallForEmergency';
import ReportIncident from './pages/ReportIncident';
import IncidentDetails from './pages/IncidentDetails';
import RiskRating from './pages/RiskRating';
import ReportSummary from './pages/ReportSummary';
import UpdatesAndAnnouncements from './pages/UpdatesAndAnnouncements';
import Notifications from './pages/Notifications';
import TermsAndConditions from './pages/TermsAndConditions';
import UpdateIncidentCategory from './pages/UpdateIncidentCategory';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/call-emergency" element={<CallForEmergency />} />
        <Route path="/report-incident" element={<ReportIncident />} />
        <Route path="/incident-details" element={<IncidentDetails />} />
        <Route path="/risk-rating" element={<RiskRating />} />
        <Route path="/report-summary" element={<ReportSummary />} />
        <Route
          path="/updates-and-announcements"
          element={<UpdatesAndAnnouncements />}
        />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/update-incident" element={<UpdateIncidentCategory />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
