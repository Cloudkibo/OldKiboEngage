import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { getChatRequest,createnews,resolvesession,getuserchats,getcustomers,updatestatus,assignToAgent,movedToMessageChannel,getsessions}  from '../../redux/actions/actions'
import { updateChatList}  from '../../redux/actions/actions'
import {updateSessionList} from '../../redux/actions/actions'
import moment from 'moment';
import {savechat,updatechatstatus}  from '../../redux/actions/actions'



import Autosuggest from 'react-autosuggest';
var callonce = 'false'
 var handleDate = function(d){
var c = new Date(d);
return c.getHours() + ':' + c.getMinutes()+ ' ' + c.toDateString();
}
function getSuggestions(value,cr) {
  console.log(cr);
  const languages = cr

  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.shortcode.toLowerCase().slice(0, inputLength) === inputValue
  );
}
 
function getSuggestionValue(suggestion) { // when suggestion selected, this function tells 
  return suggestion.message;                 // what should be the value of the input 
}
 
function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.shortcode}</span>
  );
}

class CustomerChatView extends Component {
  constructor(props, context) {
    // alert('calling constructor')
      //call action to get user teams 
     const usertoken = auth.getToken();
     console.log('constructor is called');
    if(usertoken != null)
     {
        console.log(usertoken);
        console.log(props.sessiondetails.customerid);
        props.getChatRequest(props.sessiondetails.customerid,usertoken,props.chatlist);
      }

        super(props, context);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.assignSessionToAgent = this.assignSessionToAgent.bind(this);
        this.assignSessionToGroup = this.assignSessionToGroup.bind(this);
        this.moveToChannel = this.moveToChannel.bind(this);
        this.resolveSession = this.resolveSession.bind(this)
        this.getSocketmessage = this.getSocketmessage.bind(this);
        this.getSocketmessageFromServer = this.getSocketmessageFromServer.bind(this);
        this.connectToCall = this.connectToCall.bind(this);
        this.connectCall = this.connectCall.bind(this);
        this.getgroupmembers = this.getgroupmembers.bind(this);
        this.state = {
          value: '',
          suggestions: getSuggestions('',props.responses)
        };
     
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);

  }

 

connectCall(data){
   if(confirm("Other person is calling you to a call. Confirm to join."))
        window.location.href = data.url;
 }
connectToCall(e){
      var call= {};
      var today = new Date();
      var uid = Math.random().toString(36).substring(7);
      var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

      var meetingURLString = 'https://api.cloudkibo.com/#/conference/'+ unique_id +'?role=visitor&companyid='+this.props.userdetails.uniqueid+'&agentemail='+this.props.userdetails.email+'&agentname='+this.props.userdetails.firstname+'&visitorname='+this.refs.customername.value+'&visitoremail='+this.refs.customeremail.value+'&request_id='+this.props.sessiondetails.request_id;
      
      call.from = this.props.userdetails.firstname;
      call.to = this.refs.customername.value;
      call.to_id = this.refs.socketid_customer.value;
      call.agentemail = this.props.userdetails.email;
      call.visitoremail = this.refs.customeremail.value;
      call.request_id = this.props.sessiondetails.request_id;
      call.url = meetingURLString;
      console.log(call);
      console.log(meetingURLString);
      this.props.route.socket.emit('connecttocall', {room: this.props.userdetails.uniqueid, stanza: call});

      var meetingURLString = 'https://api.cloudkibo.com/#/conference/'+ unique_id +'?role=agent&companyid='+this.props.userdetails.uniqueid+'&agentemail='+this.props.userdetails.email+'&agentname='+this.props.userdetails.firstname+'&visitorname='+this.refs.customername.value+'&visitoremail='+this.refs.customeremail.value+'&request_id='+this.props.sessiondetails.request_id;

      window.location.href = meetingURLString;

}
onChange(event, { newValue }) {
  
    this.setState({
      value: newValue
    });
  }
 
  onSuggestionsUpdateRequested({ value }) {
     var v = value.split(" ");
     console.log(v)
 
    this.setState({
      suggestions: getSuggestions(v[v.length-1],this.props.responses)
    });
  }

onSuggestionSelected({suggestionValue,method = 'click'})
{
  console.log("current value of input is  :" + this.state.value)
   var v = this.state.value.split(" "); 
   var prevVal = "";
   for(var i = 0;i< v.length - 1;i++)
   {
    prevVal = prevVal + " " + v[i]
   }
   console.log("current value of input is  :" + prevVal)
  if(prevVal == ""){
   this.setState({
      value: suggestionValue
    });}

else{
  
   this.setState({
      value: prevVal + " " + suggestionValue
    });
}
}

  //function to forward message received from server to socket
  getSocketmessageFromServer(message){
     this.props.route.socket.emit('getmessagefromserver',message);
    
  }


  getSocketmessage(message){
      
   //  const usertoken = auth.getToken();
   //  this.props.getuserchats(usertoken);
    
   //get updated chat messages from socket
   //   this.props.route.socket.emit('getuserchats',this.props.userdetails.uniqueid); 
    if(this.props.sessiondetails.platform == 'web'){
     this.props.updateChatList(message,this.props.new_message_arrived_rid,this.props.sessiondetails.request_id);
     }

     else{
      this.props.mobileuserchat.push(message);
      this.props.userchats.push(message);
      const usertoken = auth.getToken();
      /*** call api to update status field of chat message received from mobile to 'delivered'
      ***/
      var messages = [];
      messages.push({'uniqueid' : message.uniqueid,'request_id' : message.request_id,'status' :'delivered'});
      this.props.updatechatstatus(messages,message.customerid,usertoken);

     }
     this.forceUpdate();
  }
  getgroupmembers(data){
    //alert(data.getmembers.join(" "));
    this.refs.groupmembers.value = data.getmembers.join(" ");
    this.forceUpdate()
  }
  componentDidMount() {
    const { socket,dispatch } = this.props;
    this.props.route.socket.on('send:message',this.getSocketmessage);
    this.props.route.socket.on('connecttocall',this.connectCall);
    this.props.route.socket.on('send:groupmembers',this.getgroupmembers);
   // this.props.route.socket.on('send:messageToSocket',this.getSocketmessageFromServer);//for mobile customers
  //  this.props.route.socket.on('customer_joined',data =>this.props.updateSessionList(data));
 
  }

 
    
  componentDidUpdate() {
    const messageList = this.refs.messageList;
    messageList.scrollTop = messageList.scrollHeight;
  }

 
 
   handleMessageSubmit(e) {
    console.log('handleMessageSubmit' + e.which)
    console.log(this.state.value)
    callonce = "false";
    var messageVal = this.state.value
    const { socket,dispatch } = this.props;
    
     if (e.which === 13 && messageVal !="") {
          
        e.preventDefault();
            //generate unique id of message - this change is for mobile clients
        var today = new Date();
        var uid = Math.random().toString(36).substring(7);
        var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
       
         var saveChat = { 
                          'to' : this.refs.customername.value,
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'status' : 'sent',
                          'type': 'message',
                          'uniqueid' : unique_id,
                          'msg' : messageVal,
                          'datetime' : Date.now(),
                          'time' : moment.utc().format('lll'),
                          'request_id' : this.props.sessiondetails.request_id,
                          'messagechannel': this.refs.channelid.value,
                          'companyid': this.props.userdetails.uniqueid,
                          'is_seen':'no',
                          'customerid' : this.props.sessiondetails.customerid,
                          'groupmembers' : this.refs.groupmembers.value.trim().split(" "),
                          'sendersEmail' : this.props.userdetails.email,
                      }
        if(this.props.sessiondetails.platform == 'mobile'){
          saveChat.fromMobile = 'yes'
        }  
        this.props.savechat(saveChat);
        //socket.emit('send:message', saveChat);

        // for mobile customers
        if(this.props.sessiondetails.platform == 'mobile'){
             this.props.mobileuserchat.push(saveChat);
        }

        //for web customers
        else{
        this.props.chatlist.push(saveChat);
        }
            
                     
        this.state.value ='';
        this.forceUpdate();
      }
    }

/***** emit message on socket once it is saved on server ***/
 componentWillReceiveProps(props){

  if(props.ismessageSaved && props.tempMessage && props.ismessageSaved == "true" && callonce == "false"){
      //alert('chat message saved on server');
      if(props.tempMessage.assignedagentemail){
         this.props.route.socket.emit('send:agentsocket' , props.tempMessage);
        
      }
      else{
      this.props.route.socket.emit('send:message',props.tempMessage);
    }
      //this.props.ismessageSaved = "false";
      callonce = "true";
  }
 }
 resolveSession(e){

  // Only assigned agent can resolve session 
    const { socket,dispatch } = this.props;
  var agentingroup = false

   // check that agent is in this group

   if(this.props.sessiondetails.agent_ids.type == "group")
   {
    for(var i=0;i<this.props.groupagents.length;i++){
      if(this.props.groupagents[i].groupid._id == this.props.sessiondetails.agent_ids.id && this.props.userdetails._id == this.props.groupagents[i].agentid._id){
        agentingroup = true
        break
      }
   }
  }

  if(this.props.sessiondetails.status == "new"){
      alert('You cannot resolve this session.Only assigned sessions can be resolved')
 
  } 
  else if(this.props.userdetails._id != this.props.sessiondetails.agent_ids.id && this.props.sessiondetails.agent_ids.type == "agent"){
    alert('You cannot resolve this session.Only agent assigned to this session can resolve this session')
  }

  else if(agentingroup == false){
    alert('You cannot resolve this session.Only agent assigned to this session can resolve this session')
  }


  else{
        //generate unique id of message - this change is for mobile clients
        var today = new Date();
        var uid = Math.random().toString(36).substring(7);
        var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
   
        var saveChat = { 
                          'to' : this.refs.customername.value,
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'type': 'log',
                          'status' : 'sent',
                          'uniqueid' : unique_id,
                           'msg' : 'Session is marked as Resolved',
                           'datetime' : Date.now(),
                           'customerid' : this.props.sessiondetails.customerid,
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',
                            'agentemail' : this.refs.agentList.options[this.refs.agentList.selectedIndex].value,
                            'agentid' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,
                            'groupmembers' : this.refs.groupmembers.value.trim().split(" "),
                             'sendersEmail' : this.props.userdetails.email,
                      }
         if(this.props.sessiondetails.platform == 'mobile'){
          saveChat.fromMobile = 'yes'
        } 
         // for mobile customers
        if(this.props.sessiondetails.platform == 'mobile'){
             this.props.mobileuserchat.push(saveChat);
        }

        //for web customers
        else{
        this.props.chatlist.push(saveChat);
        }


      //socket.emit('send:message', saveChat);
       callonce = "false";
   
      this.props.savechat(saveChat); 
      const usertoken = auth.getToken();
    
      this.props.resolvesession(this.props.sessiondetails.request_id,usertoken);//call action to mark session resolve;
      //update session status on socket
      socket.emit('updatesessionstatus',{'request_id':this.refs.requestid.value,
                                        'status' : 'resolved',
                                        'room' : this.props.userdetails.uniqueid,
                                        'agentid' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,
                                       });

      
      
      this.forceUpdate();
  }
 }
  




// Assign chat to other agent
  assignSessionToAgent(e){
     const { socket,dispatch } = this.props;

     // local changes
  this.props.sessiondetails.status = "assigned"; 
  this.props.sessiondetails.agent_ids =  {'id' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,'type' : 'agent'};
  

     const usertoken = auth.getToken();
    
    if(confirm("Are you sure you want to assign this session to " + this.refs.agentList.options[this.refs.agentList.selectedIndex].text))
    {
   
    // 1. Broadcast a log message to all agents and customer that session is assigned to agent
    
    //generate unique id of message - this change is for mobile clients
    var today = new Date();
    var uid = Math.random().toString(36).substring(7);
    var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
         
 var saveChat = { 
                          'to' : this.refs.customername.value,
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'uniqueid' : unique_id,
                          'customerid' : this.props.sessiondetails.customerid,
                          'type': 'log',
                          'status' : 'sent',
                           'msg' : 'Session is assigned to ' + this.refs.agentList.options[this.refs.agentList.selectedIndex].text,
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',
                           'assignedagentname': [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.name],
                           'agentid' : [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib],
                           'assignedagentemail': [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.email],
                           
                           'groupmembers' : this.refs.groupmembers.value.trim().split(" "),
                      }
         if(this.props.sessiondetails.platform == 'mobile'){
          saveChat.fromMobile = 'yes'
        } 
         // for mobile customers
        if(this.props.sessiondetails.platform == 'mobile'){
             this.props.mobileuserchat.push(saveChat);
        }

        //for web customers
        else{
        this.props.chatlist.push(saveChat);
        }
        this.refs.groupmembers.value = "";
  
        if(this.props.sessiondetails.platform == 'web'){
        socket.emit('send:message', saveChat);
      }
        // 2. Send socket id of assigned agent to customer,all chat between agent and customer will now be point to point

       // socket.emit('send:agentsocket' , saveChat);
        
        this.props.savechat(saveChat); 
        callonce = "false";
  

   
    // 3. update session status on server   
     var session = {
      request_id : this.refs.requestid.value,
      status : 'assigned',
      usertoken :usertoken,
    
    }
    this.props.updatestatus(session);

    //4. update agent assignment table on server

    // considering the use case of self assigning
    var assignment = {
      assignedto : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,
      assignedby : this.props.userdetails._id,
      sessionid : this.refs.requestid.value,
      companyid : this.props.userdetails.uniqueid,
      datetime : Date.now(),
      type : 'agent',

    }

    this.props.assignToAgent(assignment,usertoken);
   
    //update session status on socket
    socket.emit('updatesessionstatus',{'request_id':this.refs.requestid.value,
                                        'status' : 'assigned',
                                        'room' : this.props.userdetails.uniqueid,
                                        'agentid' : {'id' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,'type' : 'agent'},
                                      
                                       });

    
   
    // inform assignee that he has been assigned a Chat Session

     var informMsg = { 
                          'to' : this.refs.agentList.options[this.refs.agentList.selectedIndex].text,
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'type': 'log',
                           'msg' : 'This session is assigned to you',
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',
                            'agentemail' : [this.refs.agentList.options[this.refs.agentList.selectedIndex].value],
                            'agentid' : [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib],
         
                      }

    socket.emit('informAgent',informMsg);
    socket.emit('getCustomerSessionsList',this.props.userdetails.uniqueid);
    

    // create a news to inform agent that this session is assigned to him/her,if the assigned agent is not the user himself
    if(this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib != this.props.userdetails._id){
        var news = {
          'dateCreated' : Date.now(),
          'message' : this.props.userdetails.firstname + ' has assigned a new session to you.',
          'createdBy' :  this.props.userdetails._id,
          'unread' : 'true',
          'companyid' : this.props.userdetails.uniqueid,
          'target' :  this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,//agent id for whom the news is intended
          'url' : '/chat',
        }

        this.props.createnews(news,usertoken);
    }     

    this.forceUpdate();
  }


  }
 


// Assign chat to group
  assignSessionToGroup(e){
     const { socket,dispatch } = this.props;

     // local changes

  this.props.sessiondetails.status = "assigned"; 
  this.props.sessiondetails.agent_ids =  {'id' : this.refs.grouplist.options[this.refs.grouplist.selectedIndex].dataset.attrib,'type' : 'group'};
  

  // find the agent ids of the members with in a selected group

  var agentnames = []
  var agentemail = []
  var agentids = []


  for(var i=0;i<this.props.groupagents.length;i++){
    if(this.props.groupagents[i].groupid._id == this.refs.grouplist.options[this.refs.grouplist.selectedIndex].dataset.attrib){
      agentnames.push(this.props.groupagents[i].agentid.firstname);
      agentemail.push(this.props.groupagents[i].agentid.email);
      agentids.push(this.props.groupagents[i].agentid._id);
    }
  }

     const usertoken = auth.getToken();
    
    if(confirm("Are you sure you want to assign this session to " + this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text))
    {
   callonce = "false";
  
    // 1. Broadcast a log message to all agents and customer that session is assigned to group
    
    //generate unique id of message - this change is for mobile clients
    var today = new Date();
    var uid = Math.random().toString(36).substring(7);
    var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
         
 var saveChat = { 
                          'to' : this.refs.customername.value,
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'uniqueid' : unique_id,
                          'status' : 'sent',
                          'customerid' : this.props.sessiondetails.customerid,
                          'type': 'log',
                           'msg' : 'Session is assigned to ' + this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text,
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',

                           'assignedagentname': agentnames,
                           'agentid' : agentids,
                           'assignedagentemail': agentemail,
                           
                      }
         this.refs.groupmembers.value =  agentemail.join(" ");             
         if(this.props.sessiondetails.platform == 'mobile'){
          saveChat.fromMobile = 'yes'
        } 
         // for mobile customers
        if(this.props.sessiondetails.platform == 'mobile'){
             this.props.mobileuserchat.push(saveChat);
        }

        //for web customers
        else{
        this.props.chatlist.push(saveChat);
        socket.emit('send:message', saveChat);
        }
        
        

        // 2. Send socket id of assigned agent to customer,all chat between agent and customer will now be point to point

        //socket.emit('send:agentsocket' , saveChat);
        
        this.props.savechat(saveChat); 


   
    // 3. update session status on server   
     var session = {
      request_id : this.refs.requestid.value,
      status : 'assigned',
      usertoken :usertoken,
    
    }
    this.props.updatestatus(session);

    //4. update agent assignment table on server

    // considering the use case of self assigning
    var assignment = {
      assignedto : this.refs.grouplist.options[this.refs.grouplist.selectedIndex].dataset.attrib,
      assignedby : this.props.userdetails._id,
      sessionid : this.refs.requestid.value,
      companyid : this.props.userdetails.uniqueid,
      datetime : Date.now(),
      type : 'group',

    }

    this.props.assignToAgent(assignment,usertoken);
   
    //update session status on socket
    socket.emit('updatesessionstatus',{'request_id':this.refs.requestid.value,
                                        'status' : 'assigned',
                                        'room' : this.props.userdetails.uniqueid,
                                        'agentid' : {'id' : this.refs.grouplist.options[this.refs.grouplist.selectedIndex].dataset.attrib,'type' : 'group'},
                                      
                                       });

    
   
    // inform all group members about each others' email

    /* var informMsg = { 
                          'to' : this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text ,//group name
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'type': 'log',
                           'msg' : 'This session is assigned to group : ' +  this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text ,
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channelid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',
                           'agentemail' : agentemail,
                           'agentid' : agentids,
         
                      }*/

    socket.emit('informGroupMembers',agentemail);
    socket.emit('getCustomerSessionsList',this.props.userdetails.uniqueid);
    


   // create a news to inform all agents in the group that this session is assigned to him/her,if the assigned agent is not the user himself
    var news_array = []
    for(var i=0;i<agentids.length;i++){
    if(agentids[i] != this.props.userdetails._id){

        var news = {
          'dateCreated' : Date.now(),
          'message' : this.props.userdetails.firstname + ' has assigned a new session to ' + this.refs.grouplist.options[this.refs.grouplist.selectedIndex].text + ' group',
          'createdBy' :  this.props.userdetails._id,
          'unread' : 'true',
          'companyid' : this.props.userdetails.uniqueid,
          'target' : agentids[i],//agent id for whom the news is intended
          'url' : '/chat',
        }

        news_array.push(news);
      }
    }
    alert('Creating news ' + news_array.length);
    if(news_array.length > 0){
        this.props.createnews(news_array,usertoken);
    }
    this.forceUpdate();
  
   }
 }



 //move message to another message channel
 moveToChannel(e){
     const { socket,dispatch } = this.props;
     const usertoken = auth.getToken();
    
    alert('Are you sure,you want to move this session to another channel ?');
   this.props.sessiondetails.messagechannel.push(this.refs.channellist.value);

   // generatate unique id for the chat message
    var today = new Date();
    var uid = Math.random().toString(36).substring(7);
    var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
           
    // 1. Broadcast a log message to all agents and customer that session is moved
        var saveChat = { 
                          'to' : this.refs.customername.value,
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'uniqueid' : unique_id,
                          'status' : 'sent',
                          'customerid' : this.props.sessiondetails.customerid,
                          'type': 'log',
                          'msg' : 'Session is moved to Channel ' + this.refs.channellist.options[this.refs.channellist.selectedIndex].text ,
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.channellist.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',
                           'agentemail' : this.refs.agentList.options[this.refs.agentList.selectedIndex].value,
                           'agentid' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,
                           'groupmembers' : this.refs.groupmembers.value.trim().split(" "), 
                            'sendersEmail' : this.props.userdetails.email,    
                      }
         if(this.props.sessiondetails.platform == 'mobile'){
          saveChat.fromMobile = 'yes'
        } 
         // for mobile customers
        if(this.props.sessiondetails.platform == 'mobile'){
             this.props.mobileuserchat.push(saveChat);
        }

        //for web customers
        else{
        this.props.chatlist.push(saveChat);
        }
        
       // socket.emit('send:message', saveChat);
        callonce = "false";
  
        this.props.savechat(saveChat); 

        //save new channel id on server
        var assignment = {
            movedto : this.refs.channellist.value,
            movedfrom : this.refs.channelid.value,
            movedby : this.props.userdetails._id,
            sessionid : this.refs.requestid.value,
            companyid : this.props.userdetails.uniqueid,
            datetime : Date.now(),

    }
    this.refs.channelid.value = this.refs.channellist.value;
    this.props.movedToMessageChannel(assignment,usertoken);

     //update session status on socket
    socket.emit('updatesessionchannel',{'request_id':this.refs.requestid.value,
                                        'room' : this.props.userdetails.uniqueid,
                                        'channelid' : this.refs.channellist.value
                                                                              
                                        });

  
    this.forceUpdate();

}

   handleChange(e){
     alert(e.target.data-attrib);
   
    }

  render() {
   
    var leftStyle = {
          float: 'left',
          width:'100%',
          background:'#ddd',
 
    };
        var rightStyle = {
          float: 'right',
          width:'100%',
          background:'#cceeff',
 
    };
    var clearStyle = {
             clear:'both',
 
      };


const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange: this.onChange,
      className :"form-control input-sm" ,
      placeholder :"Type your message here and press enter to send...",
      onKeyDown :this.handleMessageSubmit,
    };


 
     return (

      <div>
           <div className="table-responsive">
             <table className="table table-colored">
             <tbody>
             <tr>
                 <td className="col-md-4">
                 <label className="control-label text-right">Assigned To</label>
                 </td>
                 <td className="col-md-4">
                 </td>
                 <td className="col-md-4">
                 <label className="control-label text-right">Move To</label>
                 </td>
             </tr>
             <tr>    
             <td className="col-md-4">
                
                  
                  <div className="input-group">
                  <select  ref = "agentList" className="form-control" onChange={this.handleChange.bind(this)} aria-describedby="basic-addon3"   >
                        {this.props.sessiondetails.platform == "web"?
                         
                         (this.props.onlineAg && this.props.onlineAg.map((agent,i) =>
                            agent.agentId == this.props.userdetails._id?
                            <option value={agent.email} data-attrib = {agent.agentId} data-type = "agent" data-name={this.props.userdetails.firstname +' '+ this.props.userdetails.lastname} data-email={this.props.userdetails.email}>Myself</option>:
                            <option value={agent.email} data-attrib = {agent.agentId} data-type = "agent" data-name={agent.agentName} data-email={agent.email}>{agent.agentName}</option>
                              
                            ))
                         :

                          this.props.agents && this.props.agents.map((agent,i) =>
                            agent._id == this.props.userdetails._id?
                            <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={this.props.userdetails.firstname +' '+ this.props.userdetails.lastname} data-email={this.props.userdetails.email}>Myself</option>:
                            <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={agent.firstname +' '+ agent.lastname} data-email={agent.email}>{agent.firstname +' '+ agent.lastname}</option>
                              
                            ) 
                                                 
                        }

                      </select>

                    
                 </div>     
              </td>

              <td className="col-md-4">
                <button className="btn btn-primary" onClick = {this.assignSessionToAgent}> Assigned To Agent</button>
              </td> 
             
             

              <td className="col-md-4">
                 <div className="input-group">
                   <select  ref = "channellist" className="form-control" onChange={this.handleChange.bind(this)}   >
                          {
                          this.props.channels && this.props.channels.filter((c) => c.groupid == this.props.sessiondetails.departmentid).map((channel,i) =>
                            <option value={channel._id}>{channel.msg_channel_name}</option>

                            )
                         }
                         
                      </select>
                   </div>   
                </td>
             {/*
              <td className="col-md-1">
                <button className="btn btn-primary" onClick = {this.picksession}> Pick Session </button>
              </td>*/}

              <td className="col-md-4">
                <button className="btn btn-primary" onClick = {this.moveToChannel}> Move </button>
              </td> 
                
              <td className="col-md-1">
                <button className="btn btn-primary" onClick = {this.resolveSession}> Resolved </button>
              </td> 
              
              </tr>

              <tr>
               <td className="col-md-4">
                 <div className="input-group">
                   <select  ref = "grouplist" className="form-control" onChange={this.handleChange.bind(this)}   >
                          {
                          this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                            <option value={group._id} data-attrib = {group._id}>{group.groupname}</option>

                            )
                         }
                         
                      </select>
                   </div>   
               </td>
                <td className="col-md-4">
                <button className="btn btn-primary" onClick = {this.assignSessionToGroup}> Assigned To Group</button>
                </td>


               <td className="col-md-4">
                <label>Current Status - {this.props.sessiondetails.status}</label>
                </td>
                

            </tr>
              </tbody>
            </table>
         
          </div>

          <div className="panel-body">
          {
            this.props.sessiondetails &&
          <div>
          <label>Customer Name :</label>
          <input value = {this.props.sessiondetails.customerid.customerID} ref="customername"/>
          
           <label>Email :</label>
           <input value = {this.props.sessiondetails.customerid.email?this.props.sessiondetails.customerid.email:"N/A"} ref="customeremail"/>
          <br/>
          <input type ="hidden" value = {this.props.sessiondetails.request_id} ref = "requestid"/>
          <input type="hidden" defaultValue = {this.props.socketid} ref = "agentsocket"/>
          <input type="text" defaultValue = "" ref="groupmembers"/>
          
          <input type="hidden" value = {this.props.sessiondetails.messagechannel[this.props.sessiondetails.messagechannel.length-1]} ref="channelid"/>
          <input type="hidden" value = {this.props.sessiondetails.socketid} ref = "socketid_customer"/>
          </div>
          }
            <ul className="chat" style={{wordWrap: 'break-word', margin: '0', overflowY: 'auto', padding: '0', paddingBottom: '1em', flexGrow: '1', order: '1',width:600+'px'}}  ref="messageList">
                          
                          {this.props.sessiondetails.platform == "mobile" && this.props.mobileuserchat &&
                            this.props.mobileuserchat.filter((chat) => chat.request_id == this.props.sessiondetails.request_id).map((chat, i) => (
                             
                               (this.props.userdetails.firstname === chat.from?
                                   <li className="right clearfix agentChatBox">
                                      <span className="chat-img pull-right agentChat"> {chat.from.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="pull-right primary-font">{chat.from}</strong> 
                                            <small className=" text-muted">
                                                <span className="glyphicon glyphicon-time"></span>{handleDate(chat.datetime)}
                                            </small>
                                        </div>
                                       <p  className='pull-right chatmsg'>
                                            {chat.msg}
                                       </p>
                                     </div>
                                   </li> :

                                    <li className="left clearfix userChatBox">
                                      <span className="chat-img pull-left userChat">
                                      {chat.from.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="primary-font">{chat.from}</strong> 
                                            <small className="pull-right text-muted">
                                                <span className="glyphicon glyphicon-time"></span>{handleDate(chat.datetime)}                                            </small>
                                        </div>
                                       <p className="chatmsg">
                                            {chat.msg}
                                       </p>
                                     </div>
                                   </li>

                               )
                               
                                                          
                            ))
                          }
                           {this.props.sessiondetails.platform == "web" && this.props.chatlist &&
                            this.props.chatlist.filter((chat) => chat.request_id == this.props.sessiondetails.request_id).map((chat, i) => (
                             
                               (this.props.userdetails.firstname === chat.from?
                                   <li className="right clearfix agentChatBox">
                                      <span className="chat-img pull-right agentChat"> {chat.from.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="pull-right primary-font">{chat.from}</strong> 
                                            <small className=" text-muted">
                                                <span className="glyphicon glyphicon-time"></span>{handleDate(chat.datetime)}
                                            </small>
                                        </div>
                                       <p  className='pull-right chatmsg'>
                                            {chat.msg}
                                       </p>
                                     </div>
                                   </li> :

                                    <li className="left clearfix userChatBox">
                                      <span className="chat-img pull-left userChat">
                                      {chat.from.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="primary-font">{chat.from}</strong> 
                                            <small className="pull-right text-muted">
                                                <span className="glyphicon glyphicon-time"></span>{handleDate(chat.datetime)}
                                            </small>
                                        </div>
                                       <p className="chatmsg">
                                            {chat.msg}
                                       </p>
                                     </div>
                                   </li>

                               )
                               
                                                          
                            ))
                          }

                         
            </ul>
            </div>

             

             <div className="panel-footer">
                   
                      <Autosuggest  ref = "msg" suggestions={suggestions}
                      
                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}

                  

                   inputProps={inputProps} />

                   
                </div>
               <br/> 
              <button className="btn green" onClick ={this.connectToCall}> Start Call </button>  
      </div> 
  )
  }
}





function mapStateToProps(state) {
  console.log(state.dashboard.team);
  return {
    
          teamdetails:(state.dashboard.teamdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          customerchat :(state.dashboard.customerchat),
          chatlist :(state.dashboard.chatlist),
          channels :(state.dashboard.channels),
          customers:(state.dashboard.customers),
          new_message_arrived_rid :(state.dashboard.new_message_arrived_rid),        
          userchats :(state.dashboard.userchats),  
          responses :(state.dashboard.responses),  
          onlineAgents:(state.dashboard.onlineAgents),
          mobileuserchat : (state.dashboard.mobileuserchat),
          ismessageSaved : (state.dashboard.ismessageSaved),
          tempMessage :(state.dashboard.tempMessage),
          groupagents : (state.dashboard.groupagents),
          groupdetails :(state.dashboard.groupdetails),
          
  };
}

export default connect(mapStateToProps,{updatechatstatus,resolvesession,getChatRequest,getuserchats,createnews,updateChatList,movedToMessageChannel,getsessions,getcustomers,updateSessionList,savechat,assignToAgent,updatestatus})(CustomerChatView);
