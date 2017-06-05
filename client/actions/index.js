export const GET_LOGON = "GET_LOGIN";
export const RECEIVED_LOGON = "RECEIVED_LOGON";

export function getLogon(username, password) {

  const URL = window.location.origin + "/api/login"
  
  return dispatch => {
    dispatch({type: GET_LOGON});

    return fetch(URL, {
      method: 'POST',
      body: JSON.stringify({
        email: 'lewjturner@gmail.com',
        pin: 1234
      })
    });
  }
}