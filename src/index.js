import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RegisterLogin from './components/RegisterLogin/RegisterLogin';
import reportWebVitals from './reportWebVitals';

const url_for_backend = "https://split-backend-k1db.onrender.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App currentUser={'sai'}/> */}
    <RegisterLogin />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export {url_for_backend};