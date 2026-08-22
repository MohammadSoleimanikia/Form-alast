export const handleClearAuthSessions = () => {
  localStorage.removeItem('cur-t'); // login current time
  //
  localStorage.removeItem('cur-t-s'); // signup current time
  localStorage.removeItem('mode-s'); // signup mode
  //
  sessionStorage.removeItem('m'); // mobile number
};
