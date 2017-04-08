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
var changecc ={
  'cursor': 'pointer',
  'background' : 'rgba(243, 86, 93, 0.18)',
}


var unreadCount = 0;
for(var i = 0;i< props.userchat.length;i++){
  if(props.userchat[i].seen == false)
  {
      unreadCount = unreadCount+1;
  }
}

//console.log('thisChat' + thisChat)

//console.log(unread);
var handleDate = function(d){
var c = new Date(d);
var res = c.getHours() + ":" + c.getMinutes() + " " + c.toDateString()
return res;
}




  return (

    (unreadCount > 0 ?
     <div className="list-group-item" style={{'width':'300px','height':'70px','backgroundColor' : 'rgba(243, 86, 93, 0.18)'}} onClick={props.onClickSession}>
     <img src={props.customer.profile_pic} width="50" height="50" className="user-avatar" style={hleft}/>

     <h4 className = 'list-group-item-heading' style={hleft}>{props.customer.first_name + ' '+props.customer.last_name}</h4>
      {(unreadCount == 0?
       <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

       )}

    </div>
    :
     <div className="list-group-item" style={{'width':'300px','height':'70px'}} onClick={props.onClickSession}>
     <img src={props.customer.profile_pic} width="50" height="50" className="user-avatar" style={hleft}/>

     <h4 className = 'list-group-item-heading' style={hleft}>{props.customer.first_name + ' '+props.customer.last_name}</h4>
      {(unreadCount == 0?
       <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

       )}

    </div>
    )
 
  );
}


export default FbCustomerListItem;
