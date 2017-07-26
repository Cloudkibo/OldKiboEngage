import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import {updatefileuploadStatusChatSession, getChatRequest,uploadChatfile,removeDuplicates,createnews,resolvesession,getuserchats,getcustomers,updatestatus,assignToAgent,movedToMessageChannel,getsessions}  from '../../redux/actions/actions'
import { updateChatList,removeDuplicatesWebChat}  from '../../redux/actions/actions'
import {updateSessionList} from '../../redux/actions/actions'
import moment from 'moment';
import {savechat,updatechatstatus,downloadfile,getchatfromAgent}  from '../../redux/actions/actions'
import { FileUpload } from 'redux-file-upload';
import SweetAlert from 'sweetalert-react';
import {printlogs} from '../../services/clientlogging';

import {
  
  formatAMPM,handleAgentName,displayDateForChat,showDateForChat} from '../facebookChat/utility';
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
  printlogs('log',cr);
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
     printlogs('log','constructor is called');
    if(usertoken != null)
     {
        printlogs('log',usertoken);
        printlogs('log',props.sessiondetails.customerid);

        props.getChatRequest(props.sessiondetails.customerid,usertoken,props.chatlist);
      }

        super(props, context);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.assignSessionToAgent = this.assignSessionToAgent.bind(this);
       // this.assignSessionToTeam = this.assignSessionToTeam.bind(this);
        this.moveToSubgroup = this.moveToSubgroup.bind(this);
        this.resolveSession = this.resolveSession.bind(this)
       // this.getSocketmessage = this.getSocketmessage.bind(this);
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
      this.onFileSubmit();
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
onFileSubmit()
    {
        const usertoken = auth.getToken();
        var fileData = new FormData();

        if ( this.state.userfile ) {
              printlogs('log',this.state.userfile)

              this.props.updatefileuploadStatusChatSession(true);
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
       // event.preventDefault();

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

      var meetingURLString = 'https://api.cloudkibo.com/#/conference/'+ unique_id +'?role=visitor&conf_type=web&companyid='+this.props.userdetails.uniqueid+'&agentemail='+this.props.userdetails.email+'&agentname='+this.props.userdetails.firstname+'&visitorname='+this.refs.customername.value+'&visitoremail='+this.refs.customeremail.value+'&request_id='+this.props.sessiondetails.request_id;

      call.from = this.props.userdetails.firstname;
      call.to = this.refs.customername.value;
      call.to_id = this.refs.socketid_customer.value;
      call.agentemail = this.props.userdetails.email;
      call.visitoremail = this.refs.customeremail.value;
      call.request_id = this.props.sessiondetails.request_id;
      call.url = meetingURLString;
      printlogs('log',call);
      printlogs('log',meetingURLString);
      this.props.route.socket.emit('connecttocall', {room: this.props.userdetails.uniqueid, stanza: call});

      var meetingURLString = 'https://api.cloudkibo.com/#/conference/'+ unique_id +'?role=agent&conf_type=web&companyid='+this.props.userdetails.uniqueid+'&agentemail='+this.props.userdetails.email+'&agentname='+this.props.userdetails.firstname+'&visitorname='+this.refs.customername.value+'&visitoremail='+this.refs.customeremail.value+'&request_id='+this.props.sessiondetails.request_id;

     // window.location.href = meetingURLString;
      var win = window.open(meetingURLString, '_blank');
     // win.focus();

}
onChange(event, { newValue }) {

    this.setState({
      value: newValue
    });
  }

  onSuggestionsUpdateRequested({ value }) {
     var v = value.split(" ");
     printlogs('log',v)

    this.setState({
      suggestions: getSuggestions(v[v.length-1],this.props.responses)
    });
  }

onSuggestionSelected({suggestionValue,method = 'click'})
{
  printlogs('log',"current value of input is  :" + this.state.value)
   var v = this.state.value.split(" ");
   var prevVal = "";
   for(var i = 0;i< v.length - 1;i++)
   {
    prevVal = prevVal + " " + v[i]
   }
   printlogs('log',"current value of input is  :" + prevVal)
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



  componentDidMount() {
    const { socket,dispatch } = this.props;
   // this.props.route.socket.on('send:message',this.getSocketmessage);
  //  this.props.route.socket.on('connecttocall',this.connectCall);
   // this.props.route.socket.on('send:teammembers',this.getgroupmembers);
   // this.props.route.socket.on('send:messageToSocket',this.getSocketmessageFromServer);//for mobile customers
  //  this.props.route.socket.on('customer_joined',data =>this.props.updateSessionList(data));


    // call for first time when chat loaded from server
    if (this.props.mobileuserchat && this.props.mobileuserchat.length > 0 && this.props.sessiondetails.platform == "mobile" && (this.props.sessiondetails.agent_ids.length == 0 || this.props.userdetails._id in this.props.sessiondetails.agent_ids)){
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
   // this.scrollToBottom();
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
    printlogs('log','handleMessageSubmit' + e.which)
    printlogs('log',this.state.value)
    callonce = "false";
    var messageVal = this.state.value
    const { socket,dispatch } = this.props;
    var sendmessage = true;
//self assigning session

     if (e.which === 13 && messageVal !="") {

        e.preventDefault();
        if(this.props.sessiondetails.status == "new"){
            this.autoassignChat();
        }

       if(this.props.sessiondetails.status == "assigned" && (this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id != this.props.userdetails._id && this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == 'agent')){
          sendmessage = confirm('This chat session is already assigned. Do you still wants to proceed?');
        }

        if(sendmessage == true){
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
          saveChat.fromMobile = 'yes';
          this.props.mobileuserchat.push(saveChat);
        }
        //socket.emit('send:message', saveChat);

       
        //for web customers
        else{
        saveChat.fromMobile = 'no';
        this.props.chatlist.push(saveChat);
        }
         this.props.savechat(saveChat);
       

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

   if(this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == "group")
   {
    for(var i=0;i<this.props.teamagents.length;i++){
      if(this.props.teamagents[i].groupid._id == this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].id && this.props.userdetails._id == this.props.teamagents[i].agentid._id){
        agentingroup = true
        console.log('agent in group true');
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

  else if(agentingroup == false && this.props.sessiondetails.agent_ids[this.props.sessiondetails.agent_ids.length-1].type == "group"){
    alert('You cannot resolve this session.Only agents who are part of the assigned team can resolve this session')
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
     var agentemail = [];
     if(this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib == -1){
       alert("Please select an agent from the dropdown menu");
       return;
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
                           'teammembers' : [],
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

scrollToBottom() {
  const {thing} = this.refs;
  thing.scrollTop = thing.scrollHeight - thing.clientHeight;
}

// Assign chat to Team - Not needed any more - Zarmeen

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


    let list = this.props.mobileuserchat.filter((chat) => chat.request_id == this.props.sessiondetails.request_id).map((data, index) => {
      return (
        this.props.userdetails.firstname != data.from?
          <div key={index} ref={index} id={'chatmsg' + index} style={{'textAlign': 'left', 'clear': 'both'}}>


            { index == 0 ?
              <h4 style={styles.timestyle}>{displayDateForChat(data.datetime)}</h4> :

              index > 0 && showDateForChat(this.props.mobileuserchat.filter((chat) => chat.request_id == this.props.sessiondetails.request_id)[index-1].datetime, data.datetime) == "true" &&
              <h4 style={styles.timestyle}>{displayDateForChat(data.datetime)}</h4>

            }

            <div style={{'float': 'left'}}>
               <div style={styles.left.wrapper}>
                
                  <p style={styles.left.text}>
                          {data.type == 'file'?

                                      <button className="btn" onClick = {this.onFileDownload} data-attrib = {data.uniqueid+'.'+data.msg.split(';')[0].split('/')[1]}><i className="fa fa-download" aria-hidden="true"></i>
                                          {data.msg.split(';')[1]? data.msg.split(';')[1].substr(0,25) : 'file not available'}
                                      </button>
                                      :
                                       <span>
                                            {data.msg}
                                       </span>
                          }
                  </p>
                

             </div>



            </div>
          </div> :
          <div key={index} ref={index} id={'chatmsg' + index} style={{'textAlign': 'right', 'clear': 'both'}}>
            { index == 0 ?
              <h4 style={styles.timestyle}>{displayDateForChat(data.datetime)}</h4> :

              index > 0 && showDateForChat(this.props.mobileuserchat.filter((chat) => chat.request_id == this.props.sessiondetails.request_id)[index-1].datetime, data.datetime) == "true" &&
              <h4 style={styles.timestyle}>{displayDateForChat(data.datetime)}</h4>
            }

            {
              index == 0 ?
                <div style={styles.sendername}>{data.from }</div>
                :

                this.props.mobileuserchat.filter((chat) => chat.request_id == this.props.sessiondetails.request_id)[index-1].from != data.from &&


                <div style={styles.sendername}>{data.from}</div>



            }
            
            <div style={styles.right.wrapper}>

                 <p style={styles.left.text}>
                          {data.type == 'file'?

                                      <button className="btn" onClick = {this.onFileDownload} data-attrib = {data.uniqueid+'.'+data.msg.split(';')[0].split('/')[1]}><i className="fa fa-download" aria-hidden="true"></i>
                                          {data.msg.split(';')[1]? data.msg.split(';')[1].substr(0,25) : 'file not available'}
                                      </button>
                                      :
                                       <span>
                                            {data.msg}
                                       </span>
                          }
                  </p>

            </div>
            </div>
          )
    })



    let webchatlist = this.props.chatlist.filter((chat) => chat.request_id == this.props.sessiondetails.request_id).map((data, index) => {
      return (
        this.props.userdetails.firstname != data.from?
          <div key={index} ref={index} id={'chatmsg' + index} style={{'textAlign': 'left', 'clear': 'both'}}>


            { index == 0 ?
              <h4 style={styles.timestyle}>{displayDateForChat(data.datetime)}</h4> :

              index > 0 && showDateForChat(this.props.chatlist.filter((chat) => chat.request_id == this.props.sessiondetails.request_id)[index-1].datetime, data.datetime) == "true" &&
              <h4 style={styles.timestyle}>{displayDateForChat(data.datetime)}</h4>

            }

            <div style={{'float': 'left'}}>
               <div style={styles.left.wrapper}>
                
                  <p style={styles.left.text}>
                          {data.type == 'file'?

                                      <button className="btn" onClick = {this.onFileDownload} data-attrib = {data.uniqueid+'.'+data.msg.split(';')[0].split('/')[1]}><i className="fa fa-download" aria-hidden="true"></i>
                                          {data.msg.split(';')[1]? data.msg.split(';')[1].substr(0,25) : 'file not available'}
                                      </button>
                                      :
                                       <span>
                                            {data.msg}
                                       </span>
                          }
                  </p>
                

             </div>



            </div>
          </div> :
          <div key={index} ref={index} id={'chatmsg' + index} style={{'textAlign': 'right', 'clear': 'both'}}>
            { index == 0 ?
              <h4 style={styles.timestyle}>{displayDateForChat(data.datetime)}</h4> :

              index > 0 && showDateForChat(this.props.chatlist.filter((chat) => chat.request_id == this.props.sessiondetails.request_id)[index-1].datetime, data.datetime) == "true" &&
              <h4 style={styles.timestyle}>{displayDateForChat(data.datetime)}</h4>
            }

            {
              index == 0 ?
                <div style={styles.sendername}>{data.from }</div>
                :

                this.props.chatlist.filter((chat) => chat.request_id == this.props.sessiondetails.request_id)[index-1].from != data.from &&


                <div style={styles.sendername}>{data.from}</div>



            }
            
            <div style={styles.right.wrapper}>

                 <p style={styles.left.text}>
                          {data.type == 'file'?

                                      <button className="btn" onClick = {this.onFileDownload} data-attrib = {data.uniqueid+'.'+data.msg.split(';')[0].split('/')[1]}><i className="fa fa-download" aria-hidden="true"></i>
                                          {data.msg.split(';')[1]? data.msg.split(';')[1].substr(0,25) : 'file not available'}
                                      </button>
                                      :
                                       <span>
                                            {data.msg}
                                       </span>
                          }
                  </p>

            </div>
            </div>
          )
    })

     return (

      <div className="anotherflx">
        <div className="headerchatarea" style={{'flexBasis': 100}}>
             <div className="uk-card uk-padding-remove uk-card-body uk-card-hover uk-card-default" style={{background: '#03363D'}}>
                  <button className="uk-button uk-button-small uk-button-default uk-align-right"  style={{color: 'white', margin: 15,  background: '#1abc9c', border: 0, maxWidth: 75, fontSize: 10, marginLeft: 5}} onClick = {this.resolveSession}> Resolve </button>
                  {
                    this.props.userdetails.isAgent === "No" &&
                    <div>
                        {
                          this.props.customerchat_selected.agent_ids.length == 0 ?
                         <button className="uk-button uk-button-small uk-button-default uk-align-right"  style={{color: 'white', margin: 15,  background: '#1abc9c', border: 0, maxWidth: 150, fontSize: 10}} onClick = {this.assignSessionToAgent}> Assign To Agent</button>:
                         <button className="uk-button uk-button-small uk-button-default uk-align-right"  style={{color: 'white', margin: 15,  background: '#1abc9c', border: 0, maxWidth: 150, fontSize: 10}} onClick = {this.assignSessionToAgent}> Re-assign To Agent</button>
                         }
                   
                        <div className="uk-align-right" style={{margin: 15}}>
                          <select className="mySelect" style={{background: '#03363D', height:30, border: 0}}  ref = "agentList" onChange={this.handleChange.bind(this)} aria-describedby="basic-addon3" >

                                <option value={-1} data-attrib = {-1} data-type = "agent" data-name={-1} data-email={-1}>Select An Agent</option>

                                  {
                                    this.props.list_of_agents_in_teams && this.props.list_of_agents_in_teams.map((agent,i) =>
                                    agent._id == this.props.userdetails._id?
                                    <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={this.props.userdetails.firstname} data-email={this.props.userdetails.email}>Myself</option>:
                                    <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={agent.firstname} data-email={agent.email}>{agent.firstname +' '+ agent.lastname}</option>
                                   ) 
                                  }
                                  
                              </select>
                         </div>
                    </div>
                    }
                         <button className="uk-button uk-button-small uk-button-default uk-align-right"  style={{color: 'white', margin: 15,  background: '#1abc9c', border: 0, maxWidth: 75, fontSize: 10}} onClick = {this.moveToSubgroup}> Move </button>

                          <div className="uk-align-right" style={{margin: 15}}>
                          <input value={this.props.sessiondetails.request_id} ref="reqid" type="hidden"/>
                          <input value={this.props.sessiondetails.platform} ref="pltid" type="hidden"/>
                           <select className="mySelect" style={{background: '#03363D', height:30, border: 0}}  ref = "subgrouplist" onChange={this.handleChange.bind(this)}   >
                                  {
                                  this.props.subgroups && this.props.subgroups.filter((c) => c.groupid == this.props.sessiondetails.departmentid).map((subgroup,i) =>
                                    <option value={subgroup._id}>{subgroup.msg_channel_name}</option>

                                    )
                                 }

                              </select>
                           </div>

                         


              </div>
             
           <div className="table-responsive" style={{background: '#F5F5F5'}}>
              <SweetAlert
                show={this.state.show}
                title="Alert"
                text="Please select a team from the dropdown menu"
                onConfirm={() => this.setState({ show: false })}
              />
          </div>
          <br/>
          <div ref={`thing`}>
                      {
                        this.props.sessiondetails &&
                          <div>
                          <label>Customer Name :</label>
                          <input value = {this.props.sessiondetails.customerid.customerID} ref="customername"/>

                           <label>Email :</label>
                           <input value = {this.props.sessiondetails.customerid.email?this.props.sessiondetails.customerid.email:"N/A"} ref="customeremail"/>
                          <br/>
                          <input type ="hidden" value = {this.props.sessiondetails.request_id} ref = "requestid"/>
                          <input type="hidden" defaultValue = {'soket of agent'} ref = "agentsocket"/>

                          <input type="hidden" value = {this.props.sessiondetails.messagechannel[this.props.sessiondetails.messagechannel.length-1]} ref="subgroupid"/>
                          <input type="hidden" value = {this.props.sessiondetails.socketid} ref = "socketid_customer"/>
                          </div>
                      }
          </div>
          </div>
          {this.props.sessiondetails.platform == "mobile" && this.props.mobileuserchat &&
          <article style={{'backgroundColor' :'rgb(245, 245, 245)'}}>
                    
          {list}
          </article>
            }

           {this.props.sessiondetails.platform == "web" && this.props.chatlist &&  
            <article style={{'backgroundColor' :'rgb(245, 245, 245)'}}>
              {webchatlist}
             </article>   
            }
         

           <div className="footerchatarea">
             
           {/*
              <div className="row">
                    <div className="col-md-12 col-sm-12 col-lg-12">
                        <Autosuggest  ref = "msg" suggestions={suggestions}
                              onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                              getSuggestionValue={getSuggestionValue}
                              renderSuggestion={renderSuggestion}
                              inputProps={inputProps} />
                    </div>
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
                */}
          <div style={styles.inputContainer}>
            <div style={styles.inputField}>
              <Autosuggest ref="msg" suggestions={suggestions}

                           onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                           getSuggestionValue={getSuggestionValue}
                           renderSuggestion={renderSuggestion}


                           inputProps={inputProps}/>
            </div>



            <div style={styles.toolbox}>
            {this.props.sessiondetails.platform != "web" &&
              <div style={{display: 'inline-block'}} data-tip="attachments">
        
                <i style={styles.iconclass} onClick={() => {
                  this.refs.selectFile.click()
                }}>
                  <i style={{
                    fontSize: '25px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '2.5em',
                    textAlign: 'center'
                  }} className="fa fa-paperclip"></i>
                </i>
                <input ref="selectFile" type="file" onChange={this._onChange} style={styles.inputf}/>

              </div>
            }

              {this.props.sessiondetails.platform == "web" &&
               <div style={{display: 'inline-block'}} data-tip="Start Call" onClick={this.connectToCall}>
                <i style={styles.iconclass}>
                  <i style={{
                    fontSize: '25px',
                    color: 'red',
                    position: 'absolute',
                    right: '0',
                    width: '100%',
                    height: '2.5em',
                    textAlign: 'center'
                  }} className="fa fa-phone"></i>

                </i>
              </div>
            }
            

            </div>
          </div>
           {
            this.props.showFileUploadingChatsession && this.props.showFileUploadingChatsession == true &&
            <p style={{color: 'red'}}>Uploading file...Please wait</p>

          }

                </div>
                
      


      </div>
  )
  }
}



const textStyle = {
  fontSize: 12,

  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
  wordWrap: 'break-word',
};


const styles = {

  left: {
    container: {
      flex: 1,
      alignItems: 'flex-start',
      flexDirection: 'row',
      marginLeft: 8,
      marginRight: 0,
      flexDirection: 'row',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#f0f0f0',
      minHeight: 20,
      justifyContent: 'flex-end',
      marginBottom: 15,
      boxSizing: 'border-box',
      maxWidth: '80%',
      clear: 'both',
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
      marginLeft: '1em',
      position: 'relative',
      display: 'inline-block',
    },
      wrapperforURL: {
      borderRadius: 15,
      backgroundColor: '#f0f0f0',
      minHeight: 20,
      justifyContent: 'flex-end',
      marginBottom: 15,
      boxSizing: 'border-box',
      clear: 'both',
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
      marginLeft: '3em',
      position: 'relative',
      display: 'inline-block',
    },
    emojionly: {
      borderRadius: 15,
      minHeight: 20,
      justifyContent: 'flex-end',
      boxSizing: 'border-box',
      maxWidth: '80%',
      clear: 'both',
      /*boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
       marginBottom: 15,*/
      marginLeft: '1em',
      position: 'relative',
      display: 'inline-block',
    },

    wrapperNoColor: {
      borderRadius: 15,
      minHeight: 20,
      justifyContent: 'flex-end',

      boxSizing: 'border-box',
      maxWidth: '80%',
      clear: 'both',
      /*boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
       marginBottom: 15,*/
      marginLeft: '1em',
      position: 'relative',
      display: 'inline-block',
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
    text: {
      color: 'black',
      ...textStyle,
    },
    textEmoji: {
      color: 'black',
      fontSize: 40,
    }
  },
  right: {
    container: {
      flex: 1,
      alignItems: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
      flexDirection: 'row',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#0084ff',
      minHeight: 20,
      justifyContent: 'flex-end',
      marginBottom: 15,
      boxSizing: 'border-box',
      maxWidth: '55%',
      clear: 'both',
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
      marginLeft: '1em',
      position: 'relative',
      display: 'inline-block',
    },

     wrapperforURL: {
      borderRadius: 15,
       minHeight: 20,
      justifyContent: 'flex-end',
      marginBottom: 15,
      boxSizing: 'border-box',
      maxWidth: '55%',
      clear: 'both',
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
      marginLeft: '1em',
      position: 'relative',
      display: 'inline-block',
      textAlign:'left',
    },

    wrapperNoColor: {
      borderRadius: 15,
      minHeight: 20,
      justifyContent: 'flex-end',

      boxSizing: 'border-box',
      maxWidth: '80%',
      clear: 'both',
      /*boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
       marginBottom: 15,*/
      marginLeft: '1em',
      position: 'relative',
      display: 'inline-block',
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
    text: {
      color: 'white',
      ...textStyle,
    },
    textEmoji: {
      color: 'black',
      ...textStyle,
      fontSize: 40,
    }
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  timestyle: {
    clear: 'both',
    display: 'block',
    fontWeight: 500,
    marginTop: 12,
    marginRight: 0,
    marginBottom: 12,
    marginLeft: 20,
    textTransform: 'uppercase',
    color: 'rgba(0, 0, 0, .40)',
    fontSize: 12,
    textAlign: 'center',
  },
  imagestyle: {
    textAlign: 'center',
    padding: 10,
    width: 'inherit',
  },
  sendername: {

    position: 'relative',
    float: 'right',
    width: '100%',
    marginTop: '-10px',
    fontSize: 10,
    color: '#676161',
    marginBottom: 10,
  },
  avatarstyle: {
    borderRadius: '5px',
    /* float: left; */
    display: 'inline-block',
  },

  inputContainer: {
    display: 'table',
    margin: '0px 0px',
    width: '100%',
    borderBottom: '1px solid #dddfe2',
    borderTop: '1px solid #dddfe2',
    minHeight: 50,
    position: 'relative',

  },
  inputField: {
    minHeight: 30,
    verticalAlign: 'middle',
    width: '100%',
    padding: '15px 10px',
    height: 24,
  },
  toolbox: {
    display: 'table-cell',
    width: 100,
    padding: '0px 0',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
  },

  element: {
    display: 'inline-block',
    alignItems: 'center',
  },

  faicon: {
    margin: 10,
    cursor: 'pointer',
    fontSize: 30,
  },
  inputf: {
    display: 'none',
  },

  iconclass: {
    height: 24,
    padding: '0 15px',
    width: 24,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  },
  urltitle:{
    color: 'rgba(0, 0, 0, 1)',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '6px',
  }
};



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
          showFileUploadingChatsession:(state.dashboard.showFileUploadingChatsession),


  };
}

export default connect(mapStateToProps,{updatefileuploadStatusChatSession, updatechatstatus,removeDuplicatesWebChat,downloadfile,uploadChatfile,removeDuplicates,getchatfromAgent,resolvesession,getChatRequest,getuserchats,createnews,updateChatList,movedToMessageChannel,getsessions,getcustomers,updateSessionList,savechat,assignToAgent,updatestatus})(CustomerChatView);
