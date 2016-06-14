import React, { Component, PropTypes } from 'react'
import {logoutUser} from '../../redux/actions/actions'
import { connect } from 'react-redux';
import io from 'socket.io-client';
const socket = io('');

export default class Logout extends Component {

constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
  }
   onClick(event)
  {
    event.preventDefault();
    console.log(this.props.roomid);
    socket.emit('leave meeting for agent', {room: this.props.roomid});
    this.props.logoutUser();
  }
  render() {
    
    return (
      <div onClick={this.onClick}>
      <i className="fa fa-key"/>
  	    Logout
	    </div>
)
}

}
function mapStateToProps(state) {
  
  return {};
}
export default connect(mapStateToProps,{logoutUser})(Logout);

