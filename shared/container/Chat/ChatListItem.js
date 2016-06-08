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
var rightAgent = {
 float:'right',
 
};
var hleft = {
 float:'left',
 display:'inline',
 
};
var divMargin = {
	'margin-top': '10px',
     clear: 'both',
}

  return (
  
   <div className="list-group">
   	<a href="#" className="list-group-item">
      <h4 className = 'list-group-item-heading' style={hleft}>{props.customer.name}</h4>
       <span className='badge' style={rightStyle}>14</span>
     
      <div style={divMargin}>
      <span style={leftStyle}>{props.customer.group}</span>
      <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.name}</span>
     

      </div>
      <br/>

      <p className='list-group-item-text' style={clearStyle}>{props.customer.lastmsg}</p>

    </a>  
   </div>
  );
}


export default ChatListItem;