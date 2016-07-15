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

var c = []
var ch=[]
     {
         props.group &&
                        props.group.map((grp, i) => (
                           ag.push(grp)                            
                        ))

      }  
    

     {
         props.cust &&
                        props.cust.map((customerd, i) => (
                           c.push(customerd.name)                            
                        ))

      }  
  {
         props.channel &&
                        props.channel.map((cha, i) => (
                           ch.push(cha)                            
                        ))

      }  
var handleDate = function(d){
var c = new Date(d);
var res = c.getHours() + ":" + c.getMinutes() + " " + c.toDateString()
return res;
}    
  return (
   <div className="list-group" onClick={props.onClickSession} style={changec}>
   {
    (props.new_message_arrived_rid && props.new_message_arrived_rid == props.customer.request_id ?
  
   	<div className="list-group-item" style={changecc}>

      <h4 className = 'list-group-item-heading' style={hleft}>{c[0]}</h4>
       <span className='badge' style={rightStyle}>14</span>
     
      <div style={divMargin}>
      <span style={leftStyle}>{ag[0].deptname}</span>
      <span  style={rightAgent}><i className="glyphicon glyphicon-time"/>{handleDate(props.customer.requesttime)}</span>
      <br/>
      <span  style={rightAgent}><i className="fa fa-headphones"/>{ch[0].msg_channel_name}</span>
      <br/>
      <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status}</span>
         

      </div>
      <br/>

      <p className='list-group-item-text' style={clearStyle}>{props.customer.msg}</p>

    </div> :


     <div className="list-group-item" >

      <h4 className = 'list-group-item-heading' style={hleft}>{c[0]}</h4>
       <span className='badge' style={rightStyle}>14</span>
     
      <div style={divMargin}>
      <span style={leftStyle}>{ag[0].deptname}</span>
      <span  style={rightAgent}><i className="glyphicon glyphicon-time"/>{handleDate(props.customer.requesttime)}</span>
      <br/>
      <span  style={rightAgent}><i className="fa fa-headphones"/>{ch[0].msg_channel_name}</span>
      <br/>
      <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status}</span>
         

      </div>
      <br/>

      <p className='list-group-item-text' style={clearStyle}>{props.customer.msg}</p>

    </div> 
    )
  }
   </div>
  );
}


export default ChatListItem;