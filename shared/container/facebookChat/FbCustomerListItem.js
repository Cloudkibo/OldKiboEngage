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

//console.log('thisChat' + thisChat)

//console.log(unread);
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




  return (

    (selected ?
     <div className="list-group-item" style={{'width':'100%','backgroundColor' : 'rgba(195, 188, 188, 0.4)','height':'auto'}} onClick={props.onClickSession}>
     <img src={props.customer.user_id.profile_pic} width="36" height="36" className="user-avatar" style={hleft}/>
    <span className = 'list-group-item-heading' style={customername}>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</span>
    <span  style={changefont}><i className="glyphicon glyphicon-calendar" style={{fontSize:10}}/>{handleDate(props.customer.lastmessage.timestamp)}</span>
             
      <br/>
    <span><i className="fa fa-globe"/>{'Page: '+ props.customer.pageid.pageTitle}</span>
    <span  style={changefont}><i className="glyphicon glyphicon-time" style={{fontSize:10}}/>{handleTime(props.customer.lastmessage.timestamp)}</span>

      {(unreadCount == 0?
       <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

       )}
    <br/>
       {
              agentname.length > 0?
              
                 <span style={statusstyle} ><i className="fa fa-headphones"/>{props.customer.status == 'assigned'? props.customer.status + ' to ': props.customer.status + ' by '} {agentname[agentname.length-1]}</span>
              :
                 <span style={statusstyle}><i className="fa fa-headphones"/>{props.customer.status}</span>
              
            }
     


    </div>
    :
    unreadCount > 0 ?
   ( <div className="list-group-item" style={{'width':'100%', 'cursor': 'pointer', 'backgroundColor' : 'rgba(255, 0, 0, 0.3)','height':'auto'}} onClick={props.onClickSession}>
    <img src={props.customer.user_id.profile_pic} width="36" height="36" className="user-avatar" style={hleft}/>
    <span className='badge' style={rightStyle}>{unreadCount}</span>
    
    <span className = 'list-group-item-heading' style={customername}>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</span>
    <span  style={changefont}><i className="glyphicon glyphicon-calendar" style={{fontSize:10}}/>{handleDate(props.customer.lastmessage.timestamp)}</span>
             
      <br/>
    <span><i className="fa fa-globe"/>{'Page: '+ props.customer.pageid.pageTitle}</span>
    
    <span  style={changefont}><i className="glyphicon glyphicon-time" style={{fontSize:10}}/>{handleTime(props.customer.lastmessage.timestamp)}</span>
    <br/> 
  {
          agentname.length > 0?
          
             <span style={statusstyle} ><i className="fa fa-headphones"/>{props.customer.status == 'assigned'? props.customer.status + ' to ': props.customer.status + ' by '} {agentname[agentname.length-1]}</span>
          :
             <span style={statusstyle}><i className="fa fa-headphones"/>{props.customer.status}</span>
          
        }


   </div>
   )
   :
    (<div className="list-group-item" style={{'width':'100%', 'cursor': 'pointer', 'height':'auto'}} onClick={props.onClickSession}>
     <img src={props.customer.user_id.profile_pic} width="36" height="36" className="user-avatar" style={hleft}/>
     <span className = 'list-group-item-heading' style={customername}>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</span>
     <span  style={changefont}><i className="glyphicon glyphicon-calendar" style={{fontSize:10}}/>{handleDate(props.customer.lastmessage.timestamp)}</span>
             
      <br/>
    <span><i className="fa fa-globe"/>{'Page: '+ props.customer.pageid.pageTitle}</span>
    <span  style={changefont}><i className="glyphicon glyphicon-time" style={{fontSize:10}}/>{handleTime(props.customer.lastmessage.timestamp)}</span>
      <br/>
       {
              agentname.length > 0?
              
                 <span style={statusstyle} ><i className="fa fa-headphones"/>{props.customer.status == 'assigned'? props.customer.status + ' to ': props.customer.status + ' by '} {agentname[agentname.length-1]}</span>
              :
                 <span style={statusstyle}><i className="fa fa-headphones"/>{props.customer.status}</span>
              
            }
    </div>
    ))

  );
}


export default FbCustomerListItem;
