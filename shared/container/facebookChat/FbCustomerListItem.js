import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Avatar from 'react-avatar';

function FbCustomerListItem(props) {

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
var hright = {
 float:'right',
 display:'inline',

};
var divMargin = {
	'margin-top': '10px',
  'clear': 'both',
}



//console.log('thisChat' + thisChat)

//console.log(unread);
var handleDate = function(d){
var c = new Date(d);
var res = c.getHours() + ":" + c.getMinutes() + " " + c.toDateString()
return res;
}
var pathname="https://graph.facebook.com/"+props.customer.user_id+"/picture?width=100&height=100"
  return (
     <div className="list-group-item" style={{'width':'250px','height':'70px'}}>
     <img src={pathname} width="50" height="50" className="user-avatar" style={hleft}/>
     <h4 className = 'list-group-item-heading' style={hright}>{props.customer.first_name + ' '+props.customer.last_name}</h4>
      

    </div>
    
 
  );
}


export default FbCustomerListItem;
