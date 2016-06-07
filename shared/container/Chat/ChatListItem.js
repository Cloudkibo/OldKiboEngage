import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


function ChatListItem(props) {

  var leftStyle = {
  float: 'left',
  color:'blue',
 
};
 var rightStyle = {
  float: 'right',
  background:'red',
 
};
var clearStyle = {
  clear:'both',
 
};

  return (
  
   <div className="list-group">
   	<a href="#" className="list-group-item">
      <h4 className = 'list-group-item-heading'>{props.customer.name}</h4>
      <div>
      <span style={leftStyle}>{props.customer.group}</span>
      <span className='badge' style={rightStyle}>14</span>
      </div>
      <br/>

      <p className='list-group-item-text' style={clearStyle}>{props.customer.lastmsg}</p>

    </a>  
   </div>
  );
}


export default ChatListItem;