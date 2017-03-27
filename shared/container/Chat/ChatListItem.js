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

var changecc ={
  'cursor': 'pointer',
  'background' : 'rgba(243, 86, 93, 0.18)',
}

{

}


var ag = []

var agentname = []
if(props.customer.agent_ids.length > 0 && props.customer.agent_ids[props.customer.agent_ids.length -1].type == "agent")

{
  props.agents.filter((c) => c._id == props.customer.agent_ids[props.customer.agent_ids.length -1].id).map((c,i) =>(
                           agentname.push(c.firstname + ' ' + c.lastname)
                        ))

}


if(props.customer.agent_ids.length > 0 && props.customer.agent_ids[props.customer.agent_ids.length -1].type == "group")

{
  props.group.filter((c) => c._id == props.customer.agent_ids[props.customer.agent_ids.length -1].id).map((c,i) =>(
                           agentname.push(c.groupname + ' Group')
                        ))

}

var ch=[]
     {
         props.group && props.group.length > 0 &&
                        props.group.map((grp, i) => (
                           ag.push(grp)
                        ))
      console.log(ag);
      }



  {
         props.subgroup &&
                        props.subgroup.map((cha, i) => (
                           ch.push(cha)
                        ))

      }
var unread = []
{
  props.new_message_arrived_rid && props.new_message_arrived_rid != props.selectedsession.request_id &&  props.new_message_arrived_rid.map((unre, i) => (
                           unread.push(unre)
                        ))

}

var userchatMsg = [];
{
  props.userchat &&   props.userchat.map((unre, i) => (
                           //userchatMsg.push(unre.Value.msg)
                           userchatMsg.push(unre.msg)
                        ))

}
var thisChat ='';
var unreadCount = 0;
for(var i = 0;i< unread.length;i++){
  if(unread[i] == props.customer.request_id)
  {
    thisChat = props.customer.request_id
    unreadCount = unreadCount+1;
  }
}


//console.log(unread);
var handleDate = function(d){
var c = new Date(d);
var res = c.getHours() + ":" + c.getMinutes() + " " + c.toDateString()
return res;
}
  return (
   (ag.length > 0?
   
   (props.userchat.length > 0 || props.customer.platform == 'web' ?
         <div className="list-group" onClick={props.onClickSession} style={changec}>
         {
          (props.new_message_arrived_rid && thisChat == props.customer.request_id  ?

         	<div className="list-group-item" style={changecc}>

            <h4 className = 'list-group-item-heading' style={hleft}>{props.customer.customerid.name?props.customer.customerid.name : props.customer.customerid.customerID}</h4>

             <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

            <div style={divMargin}>
            <span style={leftStyle}>{ag[0].deptname}</span>
            <span  style={rightAgent}><i className="glyphicon glyphicon-time"/>{handleDate(props.customer.requesttime)}</span>
            <br/>
            <span  style={rightAgent}><i className="fa fa-headphones"/>{ch[0].msg_channel_name}</span>
            <br/>
            <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status}</span>
           <br/>
           {
            (agentname.length > 0?
            <span  style={rightAgent}><i className="fa fa-user"/>{agentname[0]}</span>:<span/>
           )}
            </div>
            <br/>


          </div> :


           <div className="list-group-item" >

            <h4 className = 'list-group-item-heading' style={hleft}>{props.customer.customerid.name?props.customer.customerid.name : props.customer.customerid.customerID}</h4>
             {(unreadCount == 0?
             <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

             )}
            <div style={divMargin}>
            {
              ag.length > 0 ? <span style={leftStyle}>{ag[0].deptname}</span> : <span style={leftStyle}>Customer</span>
            }
            <span  style={rightAgent}><i className="glyphicon glyphicon-time"/>{handleDate(props.customer.requesttime)}</span>
            <br/>
            {
             ch.length > 0 ? <span  style={rightAgent}><i className="fa fa-headphones"/>{ch[0].msg_channel_name}</span> : <span  style={rightAgent}><i className="fa fa-headphones"/>Message Channel</span>
            }
            <br/>
            <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status}</span>
             <br/>
               {
            (agentname.length > 0?
            <span  style={rightAgent}><i className="fa fa-user"/>{agentname[0]}</span>:<span/>
           )}

            </div>
            <br/>


          </div>
          )
        }
         </div> :<div style={{'display' :'none'}}></div>
 )
:
<div style={{'display' :'none'}}></div>
)
  );
}


export default ChatListItem;
