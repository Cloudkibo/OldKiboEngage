import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { getChatRequest,uploadChatfile,removeDuplicates,createnews,resolvesession,getuserchats,getcustomers,updatestatus,assignToAgent,movedToMessageChannel,getsessions}  from '../../redux/actions/actions'
import { updateChatList,removeDuplicatesWebChat}  from '../../redux/actions/actions'
import {updateSessionList} from '../../redux/actions/actions'
import moment from 'moment';
import {savechat,updatechatstatus,downloadfile,getchatfromAgent}  from '../../redux/actions/actions'
import { FileUpload } from 'redux-file-upload'

//var DownloadButton = require('downloadbutton')


import Autosuggest from 'react-autosuggest';


var callonce = 'false'
var callonceMessage = 'false'
var newChatClicked = 'false'
var previous_message_id = 0
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
    //alert(props.sessiondetails.departmentid);
    if(usertoken != null)
     {
        console.log(usertoken);
        console.log(props.sessiondetails.customerid);

        props.getChatRequest(props.sessiondetails.customerid,usertoken,props.chatlist);
      }

        super(props, context);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.assignSessionToAgent = this.assignSessionToAgent.bind(this);
        this.assignSessionToTeam = this.assignSessionToTeam.bind(this);
        this.moveToSubgroup = this.moveToSubgroup.bind(this);
        this.resolveSession = this.resolveSession.bind(this)
        this.getSocketmessage = this.getSocketmessage.bind(this);
        this.autoassignChat = this.autoassignChat.bind(this);
        this.getSocketmessageFromServer = this.getSocketmessageFromServer.bind(this);
        this.connectToCall = this.connectToCall.bind(this);
        this.connectCall = this.connectCall.bind(this);
        this.onFileDownload = this.onFileDownload.bind(this);
        this.state = {
          value: '',
          suggestions: getSuggestions('',props.responses),
          src : '',
          userfile:null,

        };
        this._onChange = this._onChange.bind(this);
        this.onFileSubmit = this.onFileSubmit.bind(this);
        
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);

  }

_onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    this.setState({ userfile:e.target.files[0]
                       });

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result,
                       });
    };
    reader.readAsDataURL(files[0]);
  }
onFileDownload(event)
    {
      event.preventDefault();
        //const usertoken = auth.getToken();
     //   alert(event.target.dataset.attrib);
        var fname = event.target.dataset.attrib;
    //    this.props.downloadfile({'uniqueid':event.target.dataset.fileid},usertoken);
    window.open('./userfiles/'+fname);

    }
onFileSubmit(event)
    {
        const usertoken = auth.getToken();
        var fileData = new FormData();

        if ( this.state.userfile ) {
              console.log(this.state.userfile)


              var today = new Date();
              var uid = Math.random().toString(36).substring(7);
              var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
               var teammembers = []
              //create array of teammembers
              if(this.props.sessiondetails.agent_ids.length > 0&& this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == 'group')
              {

                 for(var i=0;i<this.props.teamagents.length;i++){
                    if(this.props.teamagents[i].groupid._id == this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id){
                      teammembers.push(this.props.teamagents[i].agentid.email);
                    }
                 }
              }
              var saveChat = {
                          'to' : this.refs.customername.value,
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'status' : 'sent',
                          'type': 'file',
                          'uniqueid' : unique_id,
                          'msg' : this.state.userfile.type + ';' +this.state.userfile.name + ';'+this.props.userdetails.firstname + ' has shared a file',
                          'datetime' : Date.now(),
                          'request_id' : this.props.sessiondetails.request_id,
                          'messagechannel': this.refs.subgroupid.value,
                          'companyid': this.props.userdetails.uniqueid,
                          'is_seen':'no',
                          'customerid' : this.props.sessiondetails.customerid,
                          'teammembers' : teammembers,
                          'sendersEmail' : this.props.userdetails.email,
                      }
        if(this.props.sessiondetails.platform == 'mobile'){
          saveChat.fromMobile = 'yes'
        }
              fileData.append('file', this.state.userfile);
              fileData.append('request_id',this.props.sessiondetails.request_id);
              fileData.append('to', this.refs.customername.value);
              fileData.append('from', this.props.userdetails.firstname);
              fileData.append('date', Date.now());
              fileData.append('uniqueid',unique_id);
              fileData.append('filename',  this.state.userfile.name);
              fileData.append('filetype',  this.state.userfile.type);
              fileData.append('filesize',  this.state.userfile.size);
              fileData.append('chatmsg', JSON.stringify(saveChat));




        this.props.uploadChatfile(fileData,usertoken);
        }
        event.preventDefault();

    }


connectCall(data){
 
   if(confirm("Other person is calling you to a call. Confirm to join."))
        //window.location.href = data.url;
        var win = window.open(data.url, '_blank');
        win.focus();
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

     // window.location.href = meetingURLString;
      var win = window.open(meetingURLString, '_blank');
      win.focus();

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

  //alert('message received');
   //  const usertoken = auth.getToken();
   //  this.props.getuserchats(usertoken);

   //get updated chat messages from socket
   //   this.props.route.socket.emit('getuserchats',this.props.userdetails.uniqueid);
    if(this.props.sessiondetails.platform == 'web' && this.props.sessiondetails.request_id == message.request_id){
   //  alert('message arrived');
     this.props.updateChatList(message,this.props.new_message_arrived_rid,this.props.sessiondetails.request_id);
     this.props.removeDuplicatesWebChat(this.props.userchats,'uniqueid');
      this.forceUpdate();

     }

     else{
      //this.props.mobileuserchat.push(message);
      this.props.userchats.push(message);
      this.props.removeDuplicates(this.props.mobileuserchat,'uniqueid');
      this.forceUpdate();
     // alert(this.props.mobileuserchat.length);
      const usertoken = auth.getToken();
      /*** call api to update status field of chat message received from mobile to 'delivered'
      ***/
     /* var messages = [];
      messages.push({'uniqueid' : message.uniqueid,'request_id' : message.request_id,'status' :'delivered'});
       if(messages.length > 0){
        this.props.updatechatstatus(messages,message.from,usertoken,this.props.mobileuserchat);
      }*/
     }
     //this.forceUpdate();
  }

  componentDidMount() {
    const { socket,dispatch } = this.props;
    this.props.route.socket.on('send:message',this.getSocketmessage);
    this.props.route.socket.on('connecttocall',this.connectCall);
   // this.props.route.socket.on('send:teammembers',this.getgroupmembers);
   // this.props.route.socket.on('send:messageToSocket',this.getSocketmessageFromServer);//for mobile customers
  //  this.props.route.socket.on('customer_joined',data =>this.props.updateSessionList(data));


    // call for first time when chat loaded from server
    if(this.props.mobileuserchat && this.props.mobileuserchat.length > 0 && this.props.sessiondetails.platform == "mobile" && (this.props.sessiondetails.agent_ids.length == 0 || this.props.userdetails._id in this.props.sessiondetails.agent_ids)){
     //  alert('update message status to seen' + this.props.mobileuserchat.length);

    var userassigned = false;
    if(this.props.sessiondetails.agent_ids.length > 0){
        var obj = this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length - 1];
        if(obj['type'] == 'agent'){
        var current_Agent = obj['id'];
        if(current_Agent == this.props.userdetails._id){
          userassigned = true;
        }

      }
      else if(obj['type'] == 'group'){
          // if any agent in the group is the current user
          var grpid = obj['id'];
          if(this.props.teamagents){
            for(var j = 0;j< this.props.teamagents.length;j++){
              if(grpid == this.props.teamagents[j].groupid._id && this.props.userdetails._id == this.props.teamagents[j].agentid._id){
                          userassigned = true;
                          break;
              }
            }
          }
      }
    }

      // check messages send by customer and update status
      const usertoken = auth.getToken();

      /*** call api to update status field of chat message received from mobile to 'delivered'
      ***/
      var messages = [];

      for(var i=0;i < this.props.mobileuserchat.length;i++){
        if(this.props.mobileuserchat[i].from == this.props.sessiondetails.customerID  && this.props.mobileuserchat[i].status != 'seen' && this.props.mobileuserchat[i].request_id == this.props.sessiondetails.request_id){
                 messages.push({'uniqueid' : this.props.mobileuserchat[i].uniqueid,'request_id' : this.props.mobileuserchat[i].request_id,'status' :'seen'});
                 this.props.mobileuserchat[i].status = 'seen';
            }
        }
     //   alert('messages length : ' + messages.length);
      if(messages.length > 0){

      this.props.updatechatstatus(messages,this.props.sessiondetails.customerID,usertoken,this.props.mobileuserchat);
    }

    }

  }



  componentDidUpdate() {
    /*const messageList = this.refs.messageList;
    messageList.scrollTop = messageList.scrollHeight;*/
    var userassigned = false;
    if(this.props.sessiondetails.agent_ids.length > 0){
        var obj = this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length - 1];
        if(obj['type'] == 'agent'){
        var current_Agent = obj['id'];
        if(current_Agent == this.props.userdetails._id){
          userassigned = true;
        }

      }
      else if(obj['type'] == 'group'){
          // if any agent in the group is the current user
          var grpid = obj['id'];
          if(this.props.teamagents){
            for(var j = 0;j< this.props.teamagents.length;j++){
              if(grpid == this.props.teamagents[j].groupid._id && this.props.userdetails._id == this.props.teamagents[j].agentid._id){
                          userassigned = true;
                          break;
              }
            }
          }
      }
    }
    if(this.props.mobileuserchat && this.props.mobileuserchat.length > 0 && this.props.sessiondetails.platform == "mobile" && (this.props.sessiondetails.agent_ids.length == 0 || userassigned == true)){

      // check messages send by customer and update status
      const usertoken = auth.getToken();
      /*** call api to update status field of chat message received from mobile to 'delivered'
      ***/
      var messages = [];

      for(var i=0;i < this.props.mobileuserchat.length;i++){
        if(this.props.mobileuserchat[i].from == this.props.sessiondetails.customerID  && this.props.mobileuserchat[i].status != 'seen' && this.props.mobileuserchat[i].request_id == this.props.sessiondetails.request_id){
                 messages.push({'uniqueid' : this.props.mobileuserchat[i].uniqueid,'request_id' : this.props.mobileuserchat[i].request_id,'status' :'seen'});
                 this.props.mobileuserchat[i].status = 'seen'
            }
        }

      if(messages.length > 0){
      this.props.updatechatstatus(messages,this.props.sessiondetails.customerID,usertoken,this.props.mobileuserchat);
    }

    }



  }



   handleMessageSubmit(e) {
    console.log('handleMessageSubmit' + e.which)
    console.log(this.state.value)
    callonce = "false";
    var messageVal = this.state.value
    const { socket,dispatch } = this.props;

//self assigning session
      
     if (e.which === 13 && messageVal !="") {

        e.preventDefault();
        if(this.props.sessiondetails.status == "new"){
            this.autoassignChat();
        }

       if(this.props.sessiondetails.status == "assigned" && (this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id != this.props.userdetails._id && this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == 'agent')){
          alert('You cannot send message to Customer. This chat session is already assigned');

        }

        else{
        var teammembers = []
        //create array of teammembers
        if(this.props.sessiondetails.agent_ids.length > 0 && this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == 'group')
        {

           for(var i=0;i<this.props.teamagents.length;i++){
              if(this.props.teamagents[i].groupid._id == this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id){
                teammembers.push(this.props.teamagents[i].agentid.email);
              }
           }
        }
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
                          'messagechannel': this.refs.subgroupid.value,
                          'companyid': this.props.userdetails.uniqueid,
                          'is_seen':'no',
                          'customerid' : this.props.sessiondetails.customerid,
                          'teammembers' : teammembers,
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
    }

/***** emit message on socket once it is saved on server ***/
 componentWillReceiveProps(props){

  //logic to avoid duplicate message sending

  if(props.ismessageSaved && props.tempMessage && props.ismessageSaved == "true"){
      //alert('chat message saved on server');
      if(previous_message_id != props.tempMessage.uniqueid){
            if(props.tempMessage.assignedagentemail){

               this.props.route.socket.emit('send:agentsocket' , props.tempMessage);

            }
            else{
           // this.props.route.socket.emit('send:message',props.tempMessage);
            this.props.getchatfromAgent(props.tempMessage);
          }
        }
      //this.props.ismessageSaved = "false";
      //callonceMessage = "true";
      previous_message_id = props.tempMessage.uniqueid;
  }


 }
 resolveSession(e){

  // Only assigned agent can resolve session
    const { socket,dispatch } = this.props;
  var agentingroup = false

   // check that agent is in this group

   if(this.props.sessiondetails.agent_ids.type == "group")
   {
    for(var i=0;i<this.props.teamagents.length;i++){
      if(this.props.teamagents[i].groupid._id == this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id && this.props.userdetails._id == this.props.teamagents[i].agentid._id){
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

  else if(agentingroup == false && this.props.sessiondetails.agent_ids.type == "group"){
    alert('You cannot resolve this session.Only agent assigned to this session can resolve this session')
  }


  else{
        //generate unique id of message - this change is for mobile clients
        var today = new Date();
        var uid = Math.random().toString(36).substring(7);
        var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
        var teammembers = []
        //create array of teammembers
        if(this.props.sessiondetails.agent_ids.length > 0 && this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == 'group')
        {

           for(var i=0;i<this.props.teamagents.length;i++){
              if(this.props.teamagents[i].groupid._id == this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id){
                teammembers.push(this.props.teamagents[i].agentid.email);
              }
           }
        }
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
                           'messagechannel': this.refs.subgroupid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',
                            'agentemail' : this.refs.agentList.options[this.refs.agentList.selectedIndex].value,
                            'agentid' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,
                            'teammembers' : teammembers,
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
       // 3. update session status on server
     
      this.props.resolvesession(this.props.sessiondetails.request_id,usertoken,this.props.customerchat);//call action to mark session resolve;
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
     var agentemail = []

     if(this.props.deptagents.filter((ag) => ag.agentid == this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib && ag.deptid == this.props.sessiondetails.departmentid).length !== 0){
        var teammembers = []
        //create array of teammembers
        if(this.props.sessiondetails.agent_ids.length > 0 && this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == 'group')
        {

           for(var i=0;i<this.props.teamagents.length;i++){
              if(this.props.teamagents[i].groupid._id == this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id){
                teammembers.push(this.props.teamagents[i].agentid.email);
              }
           }
        }
       // local changes
       this.props.sessiondetails.status = "assigned";
       this.props.sessiondetails.agent_ids.push({'id' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,'type' : 'agent'});

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
                           'messagechannel': this.refs.subgroupid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',
                           'assignedagentname': [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.name],
                           'agentid' : [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib],
                           'assignedagentemail': [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.email],
                           'teammembers' : teammembers,
         }
         //pushing agent email to array for sending push notifications

         agentemail.push(this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.email);

         if(this.props.sessiondetails.platform == 'mobile'){
          saveChat.fromMobile = 'yes'
         }
         // for mobile customers
        if(this.props.sessiondetails.platform == 'mobile'){
             this.props.mobileuserchat.push(saveChat);
        }

       
        if(this.props.sessiondetails.platform == 'web'){
        //socket.emit('send:message', saveChat);
        //this.props.getchatfromAgent(saveChat);
        socket.emit('send:agentsocket' , saveChat);
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

        this.props.assignToAgent(assignment,usertoken,agentemail,'agent');

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
                           'msg' : 'This session is assigned to ' + this.refs.agentList.options[this.refs.agentList.selectedIndex].text,
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.subgroupid.value,
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
  else {
    alert("Selected agent is not in the team. You cannot assign session to this agent.")
  }

}



// Auto Assigning Chat Session to agent
  autoassignChat(){
     const { socket,dispatch } = this.props;
     var agentemail = []
     var teammembers = []
        //create array of teammembers
        if(this.props.sessiondetails.agent_ids.length > 0 && this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == 'group')
        {

           for(var i=0;i<this.props.teamagents.length;i++){
              if(this.props.teamagents[i].groupid._id == this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id){
                teammembers.push(this.props.teamagents[i].agentid.email);
              }
           }
        }
     // local changes
     this.props.sessiondetails.status = "assigned";
     this.props.sessiondetails.agent_ids.push({'id' : this.props.userdetails._id,'type' : 'agent'});

     const usertoken = auth.getToken();

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
                         'msg' : 'Session is assigned to ' + this.props.userdetails.firstname,
                         'datetime' : Date.now(),
                         'time' : moment.utc().format('lll'),
                         'request_id' : this.props.sessiondetails.request_id,
                         'messagechannel': this.refs.subgroupid.value,
                         'companyid': this.props.userdetails.uniqueid,
                         'is_seen':'no',
                         'assignedagentname': [this.props.userdetails.firstname],
                         'agentid' : [this.props.userdetails._id],
                         'assignedagentemail': [this.props.userdetails.email],


                         'teammembers' : teammembers,
       }
       //pushing agent email to array for sending push notifications

       agentemail.push(this.props.userdetails.email);

       if(this.props.sessiondetails.platform == 'mobile'){
        saveChat.fromMobile = 'yes'
       }
       // for mobile customers
      if(this.props.sessiondetails.platform == 'mobile'){
           this.props.mobileuserchat.push(saveChat);
      }

      if(this.props.sessiondetails.platform == 'web'){
      //socket.emit('send:message', saveChat);
      //this.props.getchatfromAgent(saveChat);
      socket.emit('send:agentsocket' , saveChat);
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
        assignedto : this.props.userdetails._id,
        assignedby : this.props.userdetails._id,
        sessionid : this.refs.requestid.value,
        companyid : this.props.userdetails.uniqueid,
        datetime : Date.now(),
        type : 'agent',
      }

      this.props.assignToAgent(assignment,usertoken,agentemail,'agent');

  //update session status on socket
  socket.emit('updatesessionstatus',{'request_id':this.refs.requestid.value,
                                      'status' : 'assigned',
                                      'room' : this.props.userdetails.uniqueid,
                                      'agentid' : {'id' : this.props.userdetails._id,'type' : 'agent'},

                                     });
// inform assignee that he has been assigned a Chat Session

   var informMsg = {
                        'to' : this.props.userdetails.firstname,
                        'from' : this.props.userdetails.firstname,
                        'visitoremail' : this.refs.customeremail.value,
                        'socketid' : this.refs.socketid_customer.value,
                        'type': 'log',
                         'msg' : 'This session is assigned to ' + this.props.userdetails.firstname,
                         'datetime' : Date.now(),
                         'time' : moment.utc().format('lll'),
                         'request_id' : this.props.sessiondetails.request_id,
                         'messagechannel': this.refs.subgroupid.value,
                         'companyid': this.props.userdetails.uniqueid,
                         'is_seen':'no',
                          'agentemail' : [this.props.userdetails.email],
                          'agentid' : [this.props.userdetails._id],

                    }

  socket.emit('informAgent',informMsg);

  socket.emit('getCustomerSessionsList',this.props.userdetails.uniqueid);
  this.forceUpdate();
 
}

// Assign chat to group
  assignSessionToTeam(e){
     const { socket,dispatch } = this.props;

     // local changes

  this.props.sessiondetails.status = "assigned";
  this.props.sessiondetails.agent_ids =  {'id' : this.refs.teamlist.options[this.refs.teamlist.selectedIndex].dataset.attrib,'type' : 'group'};


  // find the agent ids of the members with in a selected group

  var agentnames = []
  var agentemail = []
  var agentids = []


  for(var i=0;i<this.props.teamagents.length;i++){
    if(this.props.teamagents[i].groupid._id == this.refs.teamlist.options[this.refs.teamlist.selectedIndex].dataset.attrib){
      agentnames.push(this.props.teamagents[i].agentid.firstname);
      agentemail.push(this.props.teamagents[i].agentid.email);
      agentids.push(this.props.teamagents[i].agentid._id);
    }
  }

     const usertoken = auth.getToken();

    if(confirm("Are you sure you want to assign this session to " + this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text))
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
                           'msg' : 'Session is assigned to ' + this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text,
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.subgroupid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',

                           'assignedagentname': agentnames,
                           'agentid' : agentids,
                           'assignedagentemail': agentemail,

                      }
         //alert(this.refs.teammembers.value)
         if(this.props.sessiondetails.platform == 'mobile'){
          saveChat.fromMobile = 'yes'
        }
         // for mobile customers
        if(this.props.sessiondetails.platform == 'mobile'){
             this.props.mobileuserchat.push(saveChat);
        }

        //for web customers
        else{
       // this.props.chatlist.push(saveChat);
      //  socket.emit('send:message', saveChat);
        this.props.getchatfromAgent(saveChat);
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
      assignedto : this.refs.teamlist.options[this.refs.teamlist.selectedIndex].dataset.attrib,
      assignedby : this.props.userdetails._id,
      sessionid : this.refs.requestid.value,
      companyid : this.props.userdetails.uniqueid,
      datetime : Date.now(),
      type : 'group',

    }

    this.props.assignToAgent(assignment,usertoken,agentemail,'group');

    //update session status on socket
    socket.emit('updatesessionstatus',{'request_id':this.refs.requestid.value,
                                        'status' : 'assigned',
                                        'room' : this.props.userdetails.uniqueid,
                                        'agentid' : {'id' : this.refs.teamlist.options[this.refs.teamlist.selectedIndex].dataset.attrib,'type' : 'group'},

                                       });



    // inform all group members about each others' email

    /* var informMsg = {
                          'to' : this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text ,//group name
                          'from' : this.props.userdetails.firstname,
                          'visitoremail' : this.refs.customeremail.value,
                          'socketid' : this.refs.socketid_customer.value,
                          'type': 'log',
                           'msg' : 'This session is assigned to group : ' +  this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text ,
                           'datetime' : Date.now(),
                           'time' : moment.utc().format('lll'),
                           'request_id' : this.props.sessiondetails.request_id,
                           'messagechannel': this.refs.subgroupid.value,
                           'companyid': this.props.userdetails.uniqueid,
                           'is_seen':'no',
                           'agentemail' : agentemail,
                           'agentid' : agentids,

                      }*/

    socket.emit('informGroupMembers',{'agentemail': agentemail,'companyid':this.props.userdetails.uniqueid});
    socket.emit('getCustomerSessionsList',this.props.userdetails.uniqueid);



   // create a news to inform all agents in the group that this session is assigned to him/her,if the assigned agent is not the user himself
    var news_array = []
    for(var i=0;i<agentids.length;i++){
    if(agentids[i] != this.props.userdetails._id){

        var news = {
          'dateCreated' : Date.now(),
          'message' : this.props.userdetails.firstname + ' has assigned a new session to ' + this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text + ' group',
          'createdBy' :  this.props.userdetails._id,
          'unread' : 'true',
          'companyid' : this.props.userdetails.uniqueid,
          'target' : agentids[i],//agent id for whom the news is intended
          'url' : '/chat',
        }

        news_array.push(news);
      }
    }
   // alert('Creating news ' + news_array.length);
    if(news_array.length > 0){
        this.props.createnews(news_array,usertoken);
    }

    this.forceUpdate();

   }
 }



 //move message to another message channel
 moveToSubgroup(e){
     const { socket,dispatch } = this.props;
     const usertoken = auth.getToken();

   if(this.refs.subgrouplist.value != this.refs.subgroupid.value)
   {
             alert('Are you sure,you want to move this session to another subgroup ?');
             this.props.sessiondetails.messagechannel.push(this.refs.subgrouplist.value);

             // generatate unique id for the chat message
              var today = new Date();
              var uid = Math.random().toString(36).substring(7);
              var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
               var teammembers = []
              //create array of teammembers
              if(this.props.sessiondetails.agent_ids.length > 0 && this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == 'group')
              {

                 for(var i=0;i<this.props.teamagents.length;i++){
                    if(this.props.teamagents[i].groupid._id == this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id){
                      teammembers.push(this.props.teamagents[i].agentid.email);
                    }
                 }
              }
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
                                    'msg' : 'Session is moved to Subgroup ' + this.refs.subgrouplist.options[this.refs.subgrouplist.selectedIndex].text ,
                                     'datetime' : Date.now(),
                                     'time' : moment.utc().format('lll'),
                                     'request_id' : this.props.sessiondetails.request_id,
                                     'messagechannel': this.refs.subgrouplist.value,
                                     'companyid': this.props.userdetails.uniqueid,
                                     'is_seen':'no',
                                     'agentemail' : this.refs.agentList.options[this.refs.agentList.selectedIndex].value,
                                     'agentid' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,
                                     'teammembers' : teammembers,
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
                      movedto : this.refs.subgrouplist.value,
                      movedfrom : this.refs.subgroupid.value,
                      movedby : this.props.userdetails._id,
                      sessionid : this.refs.requestid.value,
                      companyid : this.props.userdetails.uniqueid,
                      datetime : Date.now(),

              }
              this.refs.subgroupid.value = this.refs.subgrouplist.value;
              this.props.movedToMessageChannel(assignment,usertoken);

               //update session status on socket
              socket.emit('updatesessionchannel',{'request_id':this.refs.requestid.value,
                                                  'room' : this.props.userdetails.uniqueid,
                                                  'subgroupid' : this.refs.subgrouplist.value

                                                  });


              this.forceUpdate();
    }
    else{
      alert('Session is already assigned to this subgroup');
    }

}

   handleChange(e){
    // alert(e.target.data-attrib);

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

    var fileData = {
                    filename: './userfiles/f800a793437201611123134.pdf',
                    mime: 'application/pdf',
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
                            <option value={agent.email} data-attrib = {agent.agentId} data-type = "agent" data-name={this.props.userdetails.firstname} data-email={this.props.userdetails.email}>Myself</option>:
                            <option value={agent.email} data-attrib = {agent.agentId} data-type = "agent" data-name={agent.agentName} data-email={agent.email}>{agent.agentName}</option>

                            ))
                         :

                          this.props.agents && this.props.agents.map((agent,i) =>
                            agent._id == this.props.userdetails._id?
                            <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={this.props.userdetails.firstname} data-email={this.props.userdetails.email}>Myself</option>:
                            <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={agent.firstname} data-email={agent.email}>{agent.firstname +' '+ agent.lastname}</option>

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
                   <select  ref = "subgrouplist" className="form-control" onChange={this.handleChange.bind(this)}   >
                          {
                          this.props.subgroups && this.props.subgroups.filter((c) => c.groupid == this.props.sessiondetails.departmentid).map((subgroup,i) =>
                            <option value={subgroup._id}>{subgroup.msg_channel_name}</option>

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
                <button className="btn btn-primary" onClick = {this.moveToSubgroup}> Move </button>
              </td>

              <td className="col-md-1">
                <button className="btn btn-primary" onClick = {this.resolveSession}> Resolved </button>
              </td>

              </tr>

              {
                this.props.teamdetails && this.props.teamdetails.length >0?
                     <tr>
                    
                         <td className="col-md-4">
                           <div className="input-group">
                             <select  ref = "teamlist" className="form-control" onChange={this.handleChange.bind(this)}   >
                                    {
                                    this.props.teamdetails && this.props.teamdetails.map((team,i) =>
                                      <option value={team._id} data-attrib = {team._id}>{team.groupname}</option>

                                      )
                                   }

                                </select>
                             </div>
                         </td>

                          <td className="col-md-4">
                          <button className="btn btn-primary" onClick = {this.assignSessionToTeam}> Assigned To Team</button>
                          </td>


                          <td className="col-md-6">
                          <label>Current Status - {this.props.sessiondetails.status}</label>
                          <br/>
                          <label>{this.props.groupdetails.filter((g) => g._id == this.props.sessiondetails.departmentid)[0].deptname}  - {this.props.subgroups.filter((g) => g._id == this.props.sessiondetails.messagechannel[this.props.sessiondetails.messagechannel.length-1])[0].msg_channel_name}</label>

                          </td>

                     </tr>:

                     <tr>
                      <td className="col-md-4">
                        <label>Chat Team List is empty</label>
                     
                      </td>
                      <td className="col-md-6">
                        <label>Current Status - {this.props.sessiondetails.status}</label>
                        <br/>
                        <label>{this.props.groupdetails.filter((g) => g._id == this.props.groupdetails.departmentid)[0].deptname}  - {this.props.subgroups.filter((g) => g._id == this.props.sessiondetails.messagechannel[this.props.sessiondetails.messagechannel.length-1])[0].msg_channel_name}</label>

                      </td>
                     </tr>

             }
                {/*}
                    <tr>
                     
                      <td className="col-md-6">
                        <label>Current Status - {this.props.sessiondetails.status}</label>
                        <br/>
                        <label>{this.props.groupdetails.filter((g) => g._id == this.props.sessiondetails.departmentid)[0].deptname}  - {this.props.subgroups.filter((g) => g._id == this.props.sessiondetails.messagechannel[this.props.sessiondetails.messagechannel.length-1])[0].msg_channel_name}</label>

                      </td>
                     </tr>*/}
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
         
          <input type="hidden" value = {this.props.sessiondetails.messagechannel[this.props.sessiondetails.messagechannel.length-1]} ref="subgroupid"/>
          <input type="hidden" value = {this.props.sessiondetails.socketid} ref = "socketid_customer"/>
          </div>
          }
            <ul className="chat" style={{wordWrap: 'break-word', margin: '0', overflowY: 'auto', overflowX:'hidden', padding: '0', paddingBottom: '1em', flexGrow: '1', order: '1',width:600+'px'}}  ref="messageList">

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
                                       {
                                        (chat.type == 'file')?

                                       <p  className='chatmsg' style={{'marginLeft':'0px'}}>
                                             <button className="btn" onClick = {this.onFileDownload} data-attrib = {chat.uniqueid+'.'+chat.msg.split(';')[0].split('/')[1]}><i className="fa fa-download" aria-hidden="true"></i>
                                          {chat.msg.split(';')[1]? chat.msg.split(';')[1].substr(0,25) : 'file not available'}</button>
                                       </p> :
                                       <p className="chatmsg" style={{'marginLeft':'0px'}}>
                                            {chat.msg}
                                       </p>
                                     }
                                     </div>
                                   </li>

                                   :
                                    <li className="left clearfix userChatBox">
                                      <span className="chat-img pull-left userChat">
                                      {chat.from.substr(0,1)}
                                      </span>
                                      <div className="chat-body clearfix">
                                        <div>
                                            <strong className="primary-font">{chat.customername?chat.customername:chat.from}</strong>
                                            <small className="pull-right text-muted">
                                                <span className="glyphicon glyphicon-time"></span>{handleDate(chat.datetime)}                                            </small>
                                        </div>
                                        {
                                        (chat.type == 'file')?
                                         <p  className='pull-right chatmsg'>
                                             <button className="btn" onClick = {this.onFileDownload} data-attrib = {chat.uniqueid+'.'+chat.msg.split(';')[0].split('/')[1]}><i className="fa fa-download" aria-hidden="true"></i>
                                          {chat.msg.split(';')[1]? chat.msg.split(';')[1].substr(0,25) : 'file not available'}</button>
                                       </p> :

                                       <p className="chatmsg">
                                            {chat.msg}
                                       </p>
                                     }
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
                                        {
                                        (chat.type == 'file')?
                                         <p  className='chatmsg' style={{'marginLeft':'0px'}}>
                                             <button className="btn" onClick = {this.onFileDownload} data-attrib = {chat.uniqueid+'.'+chat.msg.split(';')[0].split('/')[1]}><i className="fa fa-download" aria-hidden="true"></i>
                                          {chat.msg.split(';')[1]? chat.msg.split(';')[1].substr(0,25) : 'file not available'}</button>
                                       </p> :

                                       <p  className='chatmsg' style={{'marginLeft':'0px'}}>
                                            {chat.msg}
                                       </p>
                                     }
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
                                        {
                                        (chat.type == 'file')?
                                         <p  className='pull-right chatmsg'>
                                             <button className="btn" onClick = {this.onFileDownload} data-attrib = {chat.uniqueid+'.'+chat.msg.split(';')[0].split('/')[1]}><i className="fa fa-download" aria-hidden="true"></i>
                                          {chat.msg.split(';')[1]? chat.msg.split(';')[1].substr(0,25) : 'file not available'}</button>
                                       </p> :

                                       <p className="chatmsg">
                                            {chat.msg}
                                       </p>
                                     }
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

              <div className="row">




              </div>

            <div className="table-responsive">
               <table className="table table-colored">
                 <tbody>
                    <tr>
                       <td className="col-md-6">
                            <button className="btn green" onClick ={this.connectToCall}> Start Call </button>

                       </td>
                       <td className="col-md-6">
                       {this.props.sessiondetails.platform != "web"?
                            <div>
                                   <input type="file" onChange={this._onChange} className="pull-left"/>

                                   <button onClick={ this.onFileSubmit } ref="submitbtn" className="pull-right btn green pull-right" >
                                      Upload
                                    </button>
                            </div>:
                            <br/>
                        }
                       </td>
                    </tr>
                  </tbody>
                  </table>
                  </div>


      </div>
  )
  }
}





function mapStateToProps(state) {
  return {

          teamdetails:(state.dashboard.teamdetails),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          customerchat :(state.dashboard.customerchat),
          chatlist :(state.dashboard.chatlist),
          subgroups :(state.dashboard.subgroups),
          customers:(state.dashboard.customers),
          new_message_arrived_rid :(state.dashboard.new_message_arrived_rid),
          userchats :(state.dashboard.userchats),
          responses :(state.dashboard.responses),
          onlineAgents:(state.dashboard.onlineAgents),
          mobileuserchat : (state.dashboard.mobileuserchat),
          ismessageSaved : (state.dashboard.ismessageSaved),
          tempMessage :(state.dashboard.tempMessage),
          teamagents : (state.dashboard.teamagents),
          groupdetails :(state.dashboard.groupdetails),
          customerchatold :(state.dashboard.customerchatold),
          chatlist :(state.dashboard.chatlist),
          subgroups :(state.dashboard.subgroups),
          customers:(state.dashboard.customers),
          customerchat_selected :(state.dashboard.customerchat_selected),
          new_message_arrived_rid :(state.dashboard.new_message_arrived_rid),


  };
}

export default connect(mapStateToProps,{updatechatstatus,removeDuplicatesWebChat,downloadfile,uploadChatfile,removeDuplicates,getchatfromAgent,resolvesession,getChatRequest,getuserchats,createnews,updateChatList,movedToMessageChannel,getsessions,getcustomers,updateSessionList,savechat,assignToAgent,updatestatus})(CustomerChatView);
