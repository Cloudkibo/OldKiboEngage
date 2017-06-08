/**
 * Created by sojharo on 07/06/2017.
 */

import * as ActionTypes from '../constants/socketio.constants';

export function setSocketStatus(data) {
  return {
    type: ActionTypes.UPDATE_SOCKET_STATE,
    data,
  };
}

export function setUserJoinedRoom(data) {
  return {
    type: ActionTypes.UPDATE_USER_JOINED_ROOM,
    data,
  };
}
