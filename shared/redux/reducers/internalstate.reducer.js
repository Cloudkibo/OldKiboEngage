/**
 * We would use this to store the state of app i.e.
 * is the app disconnected from socket.io, we would
 * also use this to store the UI state. i.e. menu bar is selected
 * Created by sojharo on 07/06/2017.
 */

import * as ActionTypes from '../constants/socketio.constants';

const initialState = {
  isSocketConnected: true,
  userJoinedRoom: false,
};

export function internalState(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SOCKET_STATE:
      return Object.assign({}, state, {
        isSocketConnected: action.data,
      });

    case ActionTypes.UPDATE_USER_JOINED_ROOM:
      return Object.assign({}, state, {
        userJoinedRoom: action.data,
      });

    default:
      return state;
  }
}
