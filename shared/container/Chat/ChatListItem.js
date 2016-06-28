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

var changec ={
  'cursor': 'pointer',
}
  return (
  
   <div className="list-group" onClick={props.onClickSession} style={changec}>
   	<div className="list-group-item">
      <h4 className = 'list-group-item-heading' style={hleft}>{props.customer.username}</h4>
       <span className='badge' style={rightStyle}>14</span>
     
      <div style={divMargin}>
      <span style={leftStyle}>{props.customer.group}</span>
      <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.requesttime}</span>
     

      </div>
      <br/>

      <p className='list-group-item-text' style={clearStyle}>{props.customer.msg}</p>

    </div>  
   </div>
  );
}


export default ChatListItem;