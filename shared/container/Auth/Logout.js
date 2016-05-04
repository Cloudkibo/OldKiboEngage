import React, { Component, PropTypes } from 'react'
import {logoutUser} from '../../redux/actions/actions'
import { connect } from 'react-redux';
export default class Logout extends Component {

constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
  }
   onClick(event)
  {
    event.preventDefault();
    this.props.logoutUser()
  }
  render() {
    
    return (
      <button onClick={this.onClick} className="btn btn-primary">
  Logout
  </button>
)
}

}

function mapStateToProps(state) {
 
}
export default connect(mapStateToProps, { logoutUser})(Logout);