import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {printlogs} from '../../services/clientlogging';

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
  props.team.filter((c) => c._id == props.customer.agent_ids[props.customer.agent_ids.length -1].id).map((c,i) =>(
                           agentname.push(c.groupname + ' Group')
                        ))

}

var ch=[]
     {
         props.group && props.group.length > 0 &&
                        props.group.map((grp, i) => (
                           ag.push(grp)
                        ))

      }



  {
         props.subgroup &&
                        props.subgroup.map((cha, i) => {
                          // console.log('this is channel')
                          // console.log(cha)
                           ch.push(cha)
                         
                        })

      }
//console.log('ch length');
//console.log(ch.length);
var unread = []
{
  props.new_message_arrived_rid &&  props.new_message_arrived_rid.map((unre, i) => (
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


//printlogs('log',unread);
var handleDate = function(d){
var c = new Date(d);
var res = c.getHours() + ":" + c.getMinutes() + " " + c.toDateString()
return res;
}
  var difference = Math.abs(new Date().getTime() / 1000 - new Date(props.customer.requesttime).getTime() / 1000);
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
    
   (ag.length > 0?

   (props.userchat.length > 0 || props.customer.platform == 'web' ?
         <div className="list-group" onClick={props.onClickSession} style={{...changec, marginBottom:0}}>
         <hr style={{padding: 0, margin: 0}}/>
         {
          (props.new_message_arrived_rid && thisChat == props.customer.request_id  ?
           <div className="list-group-item" style={{...changecc, background: 'white', border: 0, marginTop:0, marginBottom:0}}>
            <p className = 'list-group-item-heading' style={{...hleft, fontSize: 15, color: 'black'}}><img src="img/user.png" className="uk-border-rounded" style={{maxWidth: 35, maxHeight:35}}/> {props.customer.customerid.name?props.customer.customerid.name : props.customer.customerid.customerID}
              <span>{ag[0].deptname +'-' + (ch.length>0?ch[0].msg_channel_name:'Channel - deleted')}</span>
            </p>
             <div className="uk-align-right">
            <p className="uk-text-meta " style={{color: 'white'}} ><span className='badge' style={rightStyle}>{unreadCount}</span> {difference} </p>
           <span style={{fontSize: 10, margin:5}}>{props.customer.status}</span>
            </div>
            
            

           
            <div style={divMargin}>
            
              {/*
            <span style={leftStyle}>{ag[0].deptname}</span>
            <span  style={rightAgent}><i className="glyphicon glyphicon-time"/>{handleDate(props.customer.requesttime)}</span>
            <br/>
            <span  style={rightAgent}><i className="fa fa-headphones"/>{ch[0].msg_channel_name}</span>
            <br/>
            <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status}</span>
         */}
           {
            
            (agentname.length > 0?
            <span  style={{...rightAgent, marginTop: -25, marginBottom:0}}><i className="fa fa-user"/>{agentname[0]}</span>:<span/>
           )}
            </div>

          </div> :


           <div className="list-group-item" style={{...changecc, background: 'white', border: 0, marginTop:0, marginBottom:0}}>
            <p className = 'list-group-item-heading' style={{...hleft, fontSize: 15}}><img src="img/user.png" className="uk-border-rounded" style={{maxWidth: 35, maxHeight:35}}/> {props.customer.customerid.name?props.customer.customerid.name : props.customer.customerid.customerID} 
            <p style={{fontSize: 10, marginLeft:40, marginTop: -10}}>{ag[0].deptname +'-' + (ch.length>0?ch[0].msg_channel_name:'Channel - deleted')}</p>
            <span style={{fontSize: 10, margin:5}}>{props.customer.status} </span>
            </p>


            <div className="uk-align-right">
            <p className="uk-text-meta " >{difference}</p>
            
            </div>
            
             {(unreadCount == 0?
             <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

             )}
            <div style={divMargin}>
               {
            (agentname.length > 0?
            
            <span  style={{...rightAgent, marginTop: -25, marginBottom:0}}> <img src="img/user.png" className="uk-border-rounded" style={{maxWidth: 20, maxHeight:20}}/> {agentname[0]}</span>:<span/>
           )}
            
            </div>
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
