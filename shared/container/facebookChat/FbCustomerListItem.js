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
var changefont={
  fontSize:10,
  float:'right'
}
var hleft = {
 float:'left',
 display:'inline',

};
var hright = {
 float:'right',
 display:'inline',

};
var divMargin = {
 'clear': 'both',
}
var changecc ={
  'cursor': 'pointer',
  'background' : 'rgba(195, 188, 188, 0.4)',
}
var statusstyle={
  marginLeft : 2.5+'em',
}

var customername={
  fontSize :'1.2em',
}
var agentname = []
if(props.customer.agent_ids.length > 0 && props.customer.agent_ids[props.customer.agent_ids.length -1].type == "agent")

{
  props.agents.filter((c) => c._id == props.customer.agent_ids[props.customer.agent_ids.length -1].id).map((c,i) =>(
                           agentname.push(c.firstname + ' ' + c.lastname)
                        ))

}


if(props.customer.agent_ids.length > 0 && props.customer.agent_ids[props.customer.agent_ids.length -1].type == "group")

{
  props.team.filter((c) => c._id == props.customer.agent_ids[props.customer.agent_ids.length -1].id).map((c,i) =>(
                           agentname.push('Team: '+ c.groupname)
                        ))

}

var selected = false;
if(props.customer.user_id.user_id === props.selectedCustomer.user_id.user_id && props.customer.pageid.pageid === props.selectedCustomer.pageid.pageid){
  selected = true;
}

var unreadCount = 0;
for(var i = 0;i< props.userchat.length;i++){
  if(props.userchat[i].seen == false)
  {
      unreadCount = unreadCount+1;
  }
}


var handleDate = function(d){
var c = new Date(Number(d));
var res = c.toDateString()
return res;
}

var handleTime = function(d){
var date = new Date(Number(d));

var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


 var difference = Math.abs(new Date().getTime() / 1000 - new Date(handleDate(props.customer.lastmessage.timestamp)).getTime() / 1000);
//  alert("Meray" + props.customer.lastmessage.timestamp);
 if(difference < 1){
   difference =   '1 second ago';
 }else if (difference < 60) {
    difference =  Math.floor(difference) + ' seconds ago';
} else if (difference < 3600) {
    difference = Math.floor(difference / 60) + ' minutes ago';
} else if (difference < 3600*24) {
    difference = Math.floor(difference / 3600) + ' hours ago';
} else if (difference < 3600*24*30) {
   difference = Math.floor(difference / (3600*24)) + ' days ago';
} else{
  difference = Math.floor(difference / (3600*24*30)) + ' months ago';
}

  return (

    (selected ?
     <div className="list-group-item uk-padding-small uk-padding-remove-bottom uk-card uk-card-body uk-card-default" style={{'backgroundColor' : 'rgba(195, 188, 188, 0.4)'}} onClick={props.onClickSession}>
     <img src={props.customer.user_id.profile_pic} style={{maxWidth: 35, maxHeight: 35}} className="uk-border-circle"/>
    <span style={{margin: 15}}><b>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</b></span>
    <span  style={changefont}>{difference}</span>
             
      <br/>
     { /*<span  style={changefont}><i className="glyphicon glyphicon-time" style={{fontSize:10}}/>{handleTime(props.customer.lastmessage.timestamp)}</span> */}

      {(unreadCount == 0?
       <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

       )}

       {
              agentname.length > 0?
              
             <span style={statusstyle} className="uk-align-right"><img src="img/user.png" className="uk-border-rounded" style={{maxWidth: 20, maxHeight:20}}/> {agentname[agentname.length-1]}</span>
              :
                 <span style={statusstyle}>{props.customer.status}</span>
            }
     

            <span style={{marginLeft: 0}}><img src="https://2.bp.blogspot.com/-C2LnFyB5k8Y/WIXjq5JOcSI/AAAAAAAABaI/mpVFjigXXm08iewoD0-k8mnIMvQm31I1wCPcB/s1600/facebook-logn-shadow.png" className="uk-border-rounded" style={{maxWidth: 20, maxHeight:20}}/> {props.customer.pageid.pageTitle}</span>
    </div>
    :
    unreadCount > 0 ?
   ( <div className="list-group-item uk-padding-small uk-padding-remove-bottom uk-card uk-card-body uk-card-default" style={{'width':'100%', 'cursor': 'pointer', 'backgroundColor' : 'rgba(255, 0, 0, 0.3)','height':'auto'}} onClick={props.onClickSession}>
    <img src={props.customer.user_id.profile_pic} style={{maxWidth: 35, maxHeight: 35}} className="uk-border-circle"/>
    <span className='badge' style={rightStyle}>{unreadCount}</span>
    
    <span style={{margin: 15}}> <b>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</b></span>
    <span  style={changefont}>{difference}</span>
             
      <br/>
    
    { /* <span  style={changefont}><i className="glyphicon glyphicon-time" style={{fontSize:10}}/>{handleTime(props.customer.lastmessage.timestamp)}</span> */}
    <br/> 
  {
          agentname.length > 0?
          
          <span style={statusstyle} className="uk-align-right"><img src="img/user.png" className="uk-border-rounded" style={{maxWidth: 20, maxHeight:20}}/> {agentname[agentname.length-1]}</span>
              :
                 <span style={statusstyle}>{props.customer.status}</span>
          
        }

        <span style={{marginLeft: 0}}><img src="https://2.bp.blogspot.com/-C2LnFyB5k8Y/WIXjq5JOcSI/AAAAAAAABaI/mpVFjigXXm08iewoD0-k8mnIMvQm31I1wCPcB/s1600/facebook-logn-shadow.png" className="uk-border-rounded" style={{maxWidth: 20, maxHeight:20}}/> {props.customer.pageid.pageTitle}</span>
   </div>
   )
   :
    (<div className="list-group-item uk-card uk-card-body uk-card-default uk-padding-small uk-padding-remove-bottom uk-animation-toggle" style={{'cursor': 'pointer',  background: 'white', border: 0, margin:5}} onClick={props.onClickSession}>
     <img src={props.customer.user_id.profile_pic} style={{maxWidth: 35, maxHeight: 35}} className="uk-border-circle"/>
     <span style={{margin: 15}}><b>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</b></span>
     <span  style={changefont}>{difference}</span>
             
      <br/>
    
     { /*<span  style={changefont}><i className="glyphicon glyphicon-time" style={{fontSize:10}}/>{handleTime(props.customer.lastmessage.timestamp)}</span> */}
      <br/>
    
       {
              agentname.length > 0?
              
                 <span style={statusstyle} className="uk-align-right"><img src="img/user.png" className="uk-border-rounded" style={{maxWidth: 20, maxHeight:20}}/> {agentname[agentname.length-1]}</span>
              :
                 <span style={statusstyle}>{props.customer.status}</span>
              
            }
      <span style={{marginLeft: 0}}><img src="https://2.bp.blogspot.com/-C2LnFyB5k8Y/WIXjq5JOcSI/AAAAAAAABaI/mpVFjigXXm08iewoD0-k8mnIMvQm31I1wCPcB/s1600/facebook-logn-shadow.png" className="uk-border-rounded" style={{maxWidth: 20, maxHeight:20}}/> {props.customer.pageid.pageTitle}</span>
    </div>
    ))

  );
}


export default FbCustomerListItem;