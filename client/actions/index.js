export const GET_LOGON = "GET_LOGIN";
export const RECEIVED_LOGON = "RECEIVED_LOGON";
export const ERROR_LOGON = "ERROR_LOGON";

export function getLogon(username, password) {

  const URL = window.location.origin + "/api/login"
  
  return dispatch => {
    dispatch({type: GET_LOGON});

    return fetch(URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: username,
        pin: password
      })
    }).then((response) => response.json()).then((payload) => {
      if (payload.error === undefined) {
        dispatch({
          type: RECEIVED_LOGON,
          payload: payload
        })
      } else {
        dispatch({
          type: ERROR_LOGON,
          payload: payload
        })
      }

    });
  }
}