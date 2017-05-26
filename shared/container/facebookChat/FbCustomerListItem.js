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
 'clear': 'both',
}
var changecc ={
  'cursor': 'pointer',
  'background' : 'rgba(195, 188, 188, 0.4)',
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
if(props.customer.user_id.user_id === props.selectedCustomer.user_id.user_id && props.customer.page_id.page_id === props.selectedCustomer.page_id.page_id){
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
var c = new Date(d);
var res = c.getHours() + ":" + c.getMinutes() + " " + c.toDateString()
return res;
}




  return (

    (selected ?
     <div className="list-group-item" style={{'width':'100%','backgroundColor' : 'rgba(195, 188, 188, 0.4)','height':'100px'}} onClick={props.onClickSession}>
     <img src={props.customer.user_id.profile_pic} width="36" height="36" className="user-avatar" style={hleft}/>
    <span className = 'list-group-item-heading' style={customername}>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</span>
      <br/>
    <span><i className="fa fa-globe"/>{'Page: '+ props.customer.pageid.pageTitle}</span>
      {(unreadCount == 0?
       <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

       )}
       <div style={divMargin}>
            <span  style={rightAgent}><i className="glyphicon glyphicon-time"/>{handleDate(props.customer.requesttime)}</span>
            <br/>
           {
              agentname.length > 0?
              <div>
                 <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status == 'assigned'? props.customer.status + ' to ': props.customer.status + ' by '} {agentname[agentname.length-1]}</span>
              </div>:
              <div>
                 <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status}</span>
              </div>

            }
           <br/>
      </div>


    </div>
    :
    unreadCount > 0 ?
    <div className="list-group-item" style={{'width':'100%','backgroundColor' : 'rgba(255, 0, 0, 0.6)','height':'100px'}} onClick={props.onClickSession}>
    <img src={props.customer.user_id.profile_pic} width="36" height="36" className="user-avatar" style={hleft}/>

    <span className = 'list-group-item-heading' style={customername}>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</span>
    <br/>
    <span><i className="fa fa-globe"/>{'Page: '+ props.customer.pageid.pageTitle}</span>
            
       {(unreadCount == 0?
      <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

      )}
      <div style={divMargin}>
           <span  style={rightAgent}><i className="glyphicon glyphicon-time"/>{handleDate(props.customer.requesttime)}</span>
           <br/>
          
          <br/>
          {
             agentname.length > 0?
             <div>
               <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status == 'assigned'? props.customer.status + ' to ': props.customer.status + ' by '} {agentname[agentname.length-1]}</span>
             </div>:
             <div> <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status}</span>
           </div>

           }
          <br/>
     </div>


   </div>
   :
     <div className="list-group-item" style={{'width':'100%','height':'100px'}} onClick={props.onClickSession}>
     <img src={props.customer.user_id.profile_pic} width="36" height="36" className="user-avatar" style={hleft}/>
    <span className = 'list-group-item-heading' style={customername}>{props.customer.user_id.first_name + ' '+props.customer.user_id.last_name}</span>
     <br/>
    <span><i className="fa fa-globe"/>{'Page: '+ props.customer.pageid.pageTitle}</span>
   
      {(unreadCount == 0?
       <span className='badge' style={rightStyle}></span>:<span className='badge' style={rightStyle}>{unreadCount}</span>

       )}
       <div style={divMargin}>
            <span  style={rightAgent}><i className="glyphicon glyphicon-time"/>{handleDate(props.customer.requesttime)}</span>
            <br/>
            {
              agentname.length > 0?
              <div>
                 <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status == 'assigned'? props.customer.status + ' to ': props.customer.status + ' by '} {agentname[agentname.length-1]}</span>
              </div>:
              <div>  
                     <span  style={rightAgent}><i className="fa fa-headphones"/>{props.customer.status}</span>
              </div>

            }
           <br/>

      </div>
    </div>
    )

  );
}


export default FbCustomerListItem;