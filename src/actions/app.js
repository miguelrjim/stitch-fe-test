/**
 * Created by mjimenez on 10/30/16.
 */
export const SET_APP_STATE = 'SET_APP_STATE';
export function setAppState(payload) {
  return {
    type: SET_APP_STATE,
    payload
  }
}