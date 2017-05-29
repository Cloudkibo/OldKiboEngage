import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest';
import { getfbchatfromAgent,add_socket_fb_message,updatefileuploadStatus, resolvesessionfb,uploadFbChatfile,createnews,assignToAgentFB} from '../../redux/actions/actions'
import ReactEmoji from 'react-emoji'
import { Link } from 'react-router';
import auth from '../../services/auth';
import Picker from 'react-giphy-picker';
import StickerMenu from 'react-stickerpipe';
import EmojiPicker from 'react-emojipicker';
import ReactPlayer from 'react-player'
var emojiMap = require('react-emoji-picker/lib/emojiMap');
import { FileUpload } from 'redux-file-upload';
import ReactTooltip from 'react-tooltip';

var geturl = function(payload){
//  console.log('payload');
//  console.log(payload);
 return   `https://maps.googleapis.com/maps/api/staticmap?center=${payload.coordinates.lat},${payload.coordinates.long}&zoom=13&scale=false&size=400x200&maptype=roadmap&format=png&key=AIzaSyDDTb4NWqigQmW_qCVmSAkmZIIs3tp1x8Q&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${payload.coordinates.lat},${payload.coordinates.long}`
}

var getmainURL = function(payload){
//  console.log('payload');
//  console.log(payload);
  return `https://www.google.com/maps/place/${payload.coordinates.lat},${payload.coordinates.long}/`
}

var handleDate = function(d){
if(d){

var c = new Date(Number(d));
//alert(c)
return c.getHours() + ':' + c.getMinutes()+ ' ' + c.toDateString();
}
}

var showDate = function(prev,next){
  var p = new Date(Number(prev));
  var n = new Date(Number(next));
  
  if(n.getMinutes() - p.getMinutes() > 10 ||   n.getDay() != p.getDay() || n.getMonth() != p.getMonth() || n.getFullYear() != p.getFullYear()){
   return "true";

  }
  else{
    return "false";
  }
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
var displayDate = function(x){
  var today = new Date();
  var n = new Date(Number(x))
  var days = ["SUN","MON","TUES","WED","THU","FRI","SAT"];
  var month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"] 
  var s = '';
  if(today.getFullYear() == n.getFullYear()){
      if(today.getMonth() == n.getMonth()){
          if(today.getDay() == n.getDay()){
              s =  formatAMPM(n);
          }
          else{
            s = days[n.getDay()] + "," + formatAMPM(n);
          }
      }
      else{
        s =  days[n.getDay()] + ' ' + month[n.getMonth()]  + "," + formatAMPM(n)
      }
  }
  else{
    s =  days[n.getDay()] + ' ' + month[n.getMonth()] + n.getDay() +n.getFullYear() + "," + formatAMPM(n);
  }
 // alert(s);
  return s;
}
var getSuggestions = function(value,cr) {
  console.log(cr);
  const languages = cr

  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.shortcode.toLowerCase().slice(0, inputLength) === inputValue
  );
}

var getSuggestionValue = function(suggestion) { // when suggestion selected, this function tells
  return suggestion.message;                 // what should be the value of the input
}

var renderSuggestion = function(suggestion) {
  return (
    <span>{suggestion.shortcode}</span>
  );
}



export class ChatArea extends Component {

  constructor(props, context) {
      super(props, context);
        this.state = {
          value: '',
          suggestions: getSuggestions('',props.responses),
          src : '',
          userfile:null,
          emoji: null,
          showEmojiPicker: false,
          showSticker: false,
          enteredGif: '',
          visible: false,
          longtextwarning:'',
          agentinTeam: false,
          showthisdiv: false,
      
          

        };
       this.onChange = this.onChange.bind(this);
        this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.onFileSubmit = this.onFileSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
        this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
        this.setEmoji = this.setEmoji.bind(this);
        this.sendThumbsUp = this.sendThumbsUp.bind(this);
        this.sendGIF = this.sendGIF.bind(this);
        this.toggleVisible = this.toggleVisible.bind(this);
        this.toggleStickerPicker = this.toggleStickerPicker.bind(this);
        this.sendSticker = this.sendSticker.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.scrollToTop= this.scrollToTop.bind(this);
        this.getMeta = this.getMeta.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.assignSessionToAgent = this.assignSessionToAgent.bind(this);
        this.assignSessionToTeam = this.assignSessionToTeam.bind(this);
        this.resolveSession = this.resolveSession.bind(this);
        this.autoassignChat = this.autoassignChat.bind(this);
      
  }

handleChange(e){

}

assignSessionToTeam(e){

    const { socket,dispatch } = this.props;

         // local changes
       this.props.fbsessionSelected.status = "assigned";
       this.props.fbsessionSelected.agent_ids.push({'id' : this.refs.teamlist.options[this.refs.teamlist.selectedIndex].dataset.attrib,'type' : 'group'});


  // find the agent ids of the members with in a selected group

  var agentnames = [];
  var agentemail = [];
  var agentids = [];

  if(this.refs.teamlist.options[this.refs.teamlist.selectedIndex].dataset.attrib == -1){
    alert("Please select a team from a dropdown menu");
    return;
  }

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
            // 1. Broadcast a log message to all agents and customer that session is assigned to agent

       //generate unique id of message - this change is for mobile clients
       var today = new Date();
       var uid = Math.random().toString(36).substring(7);
       var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();


       var saveMsg = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.fbsessionSelected.user_id.user_id,
              companyid:this.props.userdetails.uniqueid,
              timestamp:Date.now(),
              message:{
                mid:unique_id,
                seq:1,
                text:'Session is assigned to ' + this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text,
              },

             pageid:this.props.fbsessionSelected.pageid.pageid,

            }

    this.props.getfbchatfromAgent(saveMsg);

    var data = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.fbsessionSelected.user_id.user_id,
              companyid:this.props.userdetails.uniqueid,
              seen:false,
              message:{
                  text:'Session is assigned to ' + this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text,
                  mid: unique_id,
              },
              inbound:true,
              backColor: '#3d83fa',
              textColor: "white",
              avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
              duration: 0,
              timestamp:Date.now(),
              assignedagentname: agentnames,
              agentid : agentids,
              assignedagentemail: agentemail,

            }
    this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid,this.props.fbsessions);

     //3. update agent assignment table on server

      var assignment = {
        assignedto :  this.refs.teamlist.options[this.refs.teamlist.selectedIndex].dataset.attrib,
        assignedby : this.props.userdetails._id,
        pageid : this.props.fbsessionSelected.pageid._id,
        userid: this.props.fbsessionSelected.user_id._id,
        companyid : this.props.userdetails.uniqueid,
        datetime : Date.now(),
        type : 'group',
      }

      this.props.assignToAgentFB(assignment,usertoken,agentemail,'group');

  //update session status on socket
  socket.emit('updatesessionstatusFB',{'pageid':this.props.fbsessionSelected.pageid.pageid,
                                       'user_id':this.props.fbsessionSelected.user_id.user_id,
                                      'status' : 'assigned',
                                      'room' : this.props.userdetails.uniqueid,
                                      'agentid' : {'id' :  this.refs.teamlist.options[this.refs.teamlist.selectedIndex].dataset.attrib,'type' : 'group'},

                                     });





   // create a news to inform all agents in the group that this session is assigned to him/her,if the assigned agent is not the user himself
    var news_array = []
    for(var i=0;i<agentids.length;i++){
    if(agentids[i] != this.props.userdetails._id){

        var news = {
          'dateCreated' : Date.now(),
          'message' : this.props.userdetails.firstname + ' has assigned a new Facebook chat session to ' + this.refs.teamlist.options[this.refs.teamlist.selectedIndex].text + ' group',
          'createdBy' :  this.props.userdetails._id,
          'unread' : 'true',
          'companyid' : this.props.userdetails.uniqueid,
          'target' : agentids[i],//agent id for whom the news is intended
          'url' : '/fbchat',
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


autoassignChat(){
    const { socket,dispatch } = this.props;
    var agentemail = []
    var teammembers = []
      //create array of teammembers
      if(this.props.fbsessionSelected.agent_ids.length > 0 && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == 'group')
      {

         for(var i=0;i<this.props.teamagents.length;i++){
            if(this.props.teamagents[i].groupid._id == this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id){
              teammembers.push(this.props.teamagents[i].agentid.email);
            }
         }
      }

     const usertoken = auth.getToken();

          // local changes
       this.props.fbsessionSelected.status = "assigned";
       this.props.fbsessionSelected.agent_ids.push({'id' : this.props.userdetails._id,'type' : 'agent'});

       // 1. Broadcast a log message to all agents and customer that session is assigned to agent

       //generate unique id of message - this change is for mobile clients
       var today = new Date();
       var uid = Math.random().toString(36).substring(7);
       var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();


       var saveMsg = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.fbsessionSelected.user_id.user_id,
              companyid:this.props.userdetails.uniqueid,
              timestamp:Date.now(),
              message:{
                mid:unique_id,
                seq:1,
                text:'Session is assigned to ' + this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,
              },

             pageid:this.props.fbsessionSelected.pageid.pageid,

            }

    this.props.getfbchatfromAgent(saveMsg);

    var data = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.fbsessionSelected.user_id.user_id,
              companyid:this.props.userdetails.uniqueid,
              seen:false,
              message:{
                  text:'Session is assigned to ' + this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,
                  mid: unique_id,
              },
              inbound:true,
              backColor: '#3d83fa',
              textColor: "white",
              avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
              duration: 0,
              timestamp:Date.now(),
              assignedagentname: [this.props.userdetails.firstname],
              agentid : [this.props.userdetails._id],
              assignedagentemail: [this.props.userdetails.email],
              teammembers : teammembers,


            }
    this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid,this.props.fbsessions)
    //pushing agent email to array for sending push notifications

    agentemail.push(this.props.userdetails.email);
    //socket.emit('send:agentsocketfb' , saveChat);

     //3. update agent assignment table on server

      var assignment = {
        assignedto : this.props.userdetails._id,
        assignedby : this.props.userdetails._id,
        pageid : this.props.fbsessionSelected.pageid._id,
        userid: this.props.fbsessionSelected.user_id._id,
        companyid : this.props.userdetails.uniqueid,
        datetime : Date.now(),
        type : 'agent',
      }

      this.props.assignToAgentFB(assignment,usertoken,agentemail,'agent');

  //update session status on socket
  socket.emit('updatesessionstatusFB',{'pageid':this.props.fbsessionSelected.pageid.pageid,
                                       'user_id':this.props.fbsessionSelected.user_id.user_id,
                                       'status' : 'assigned',
                                       'room' : this.props.userdetails.uniqueid,
                                       'agentid' : {'id' : this.props.userdetails._id,'type' : 'agent'},

                                     });





  this.forceUpdate();




}
assignSessionToAgent(e){
     const { socket,dispatch } = this.props;
     var agentemail = [];
    var teammembers = [];
    if(this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib == -1){
      alert("Please select an agent from the dropdown menu");
      return;
    }
      //create array of teammembers
      if(this.props.fbsessionSelected.agent_ids.length > 0 && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == 'group')
      {

         for(var i=0;i<this.props.teamagents.length;i++){
            if(this.props.teamagents[i].groupid._id == this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id){
              teammembers.push(this.props.teamagents[i].agentid.email);
            }
         }
      }

     const usertoken = auth.getToken();

     if(confirm("Are you sure you want to assign this session to " + this.refs.agentList.options[this.refs.agentList.selectedIndex].text))
     {
          // local changes
       this.props.fbsessionSelected.status = "assigned";
       this.props.fbsessionSelected.agent_ids.push({'id' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,'type' : 'agent'});

       // 1. Broadcast a log message to all agents and customer that session is assigned to agent

       //generate unique id of message - this change is for mobile clients
       var today = new Date();
       var uid = Math.random().toString(36).substring(7);
       var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();


       var saveMsg = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.fbsessionSelected.user_id.user_id,
              companyid:this.props.userdetails.uniqueid,
              timestamp:Date.now(),
              message:{
                mid:unique_id,
                seq:1,
                text:'Session is assigned to ' + this.refs.agentList.options[this.refs.agentList.selectedIndex].text,
              },

             pageid:this.props.fbsessionSelected.pageid.pageid,

            }

    this.props.getfbchatfromAgent(saveMsg);

    var data = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.fbsessionSelected.user_id.user_id,
              companyid:this.props.userdetails.uniqueid,
              seen:false,
              message:{
                  text:'Session is assigned to ' + this.refs.agentList.options[this.refs.agentList.selectedIndex].text,
                  mid: unique_id,
              },
              inbound:true,
              backColor: '#3d83fa',
              textColor: "white",
              avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
              duration: 0,
              timestamp:Date.now(),
              assignedagentname: [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.name],
              agentid : [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib],
              assignedagentemail: [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.email],
              teammembers : teammembers,


            }
    this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid,this.props.fbsessions)
    //pushing agent email to array for sending push notifications

    agentemail.push(this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.email);
    //socket.emit('send:agentsocketfb' , saveChat);

     //3. update agent assignment table on server

      var assignment = {
        assignedto : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,
        assignedby : this.props.userdetails._id,
        pageid : this.props.fbsessionSelected.pageid._id,
        userid: this.props.fbsessionSelected.user_id._id,
        companyid : this.props.userdetails.uniqueid,
        datetime : Date.now(),
        type : 'agent',
      }

      this.props.assignToAgentFB(assignment,usertoken,agentemail,'agent');

  //update session status on socket
  socket.emit('updatesessionstatusFB',{'pageid':this.props.fbsessionSelected.pageid.pageid,
                                       'user_id':this.props.fbsessionSelected.user_id.user_id,
                                      'status' : 'assigned',
                                      'room' : this.props.userdetails.uniqueid,
                                      'agentid' : {'id' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,'type' : 'agent'},

                                     });





  // create a news to inform agent that this session is assigned to him/her,if the assigned agent is not the user himself
  if(this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib != this.props.userdetails._id){
      var news = {
        'dateCreated' : Date.now(),
        'message' : this.props.userdetails.firstname + ' has assigned a new facebook chat session to you.',
        'createdBy' :  this.props.userdetails._id,
        'unread' : 'true',
        'companyid' : this.props.userdetails.uniqueid,
        'target' :  this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,//agent id for whom the news is intended
        'url' : '/fbchat',
      }

      this.props.createnews(news,usertoken);
  }

  this.forceUpdate();
  }



}

resolveSession(e){
  // Only assigned agent can resolve session
  const { socket,dispatch } = this.props;
  var agentingroup = false
  if(this.props.fbsessionSelected.agent_ids.length > 0 && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == "group")
   {
    for(var i=0;i<this.props.teamagents.length;i++){
      if(this.props.teamagents[i].groupid._id == this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id && this.props.userdetails._id == this.props.teamagents[i].agentid._id){
        agentingroup = true
        break
      }
   }
  }

   // check that agent is in this group
   if(this.props.fbsessionSelected.status == "new"){
      alert('You cannot resolve this session.Only assigned sessions can be resolved')

  }


  else if(this.props.userdetails._id != this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == "agent"){
    alert('You cannot resolve this session.Only agent assigned to this session can resolve this session')
  }

  else if(agentingroup == false && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == "group"){
    alert('You cannot resolve this session.Only agent assigned to this session can resolve this session')
  }


  else{
        //generate unique id of message - this change is for mobile clients
        var today = new Date();
        var uid = Math.random().toString(36).substring(7);
        var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
        var teammembers = []
        //create array of teammembers
         if(this.props.fbsessionSelected.agent_ids.length > 0 && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == 'group')
        {

           for(var i=0;i<this.props.teamagents.length;i++){
              if(this.props.teamagents[i].groupid._id == this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id){
                teammembers.push(this.props.teamagents[i].agentid.email);
              }
           }
        }

         // local changes
       this.props.fbsessionSelected.status = "resolved";

       //generate unique id of message - this change is for mobile clients
       var today = new Date();
       var uid = Math.random().toString(36).substring(7);
       var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();


       var saveMsg = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.fbsessionSelected.user_id.user_id,
              companyid:this.props.userdetails.uniqueid,
              timestamp:Date.now(),
              message:{
                mid:unique_id,
                seq:1,
                text:'Session is marked as resolved by ' + this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,

              },

             pageid:this.props.fbsessionSelected.pageid.pageid,

            }

    this.props.getfbchatfromAgent(saveMsg);

    var data = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.fbsessionSelected.user_id.user_id,
              companyid:this.props.userdetails.uniqueid,
              seen:false,
              message:{
                  text:'Session is marked as resolved by ' + this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,
                  mid: unique_id,
              },
              inbound:true,
              backColor: '#3d83fa',
              textColor: "white",
              avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
              duration: 0,
              timestamp:Date.now(),
              assignedagentname: [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.name],
              agentid : [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib],
              assignedagentemail: [this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.email],
              teammembers : teammembers,


            }
    this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid,this.props.fbsessions)

      const usertoken = auth.getToken();
       // 3. update session status on server
        var resolvesessionbody = {
        pageid : this.props.fbsessionSelected.pageid._id,
        userid: this.props.fbsessionSelected.user_id._id,
        companyid : this.props.userdetails.uniqueid,
        datetime : Date.now(),
      }

      this.props.resolvesessionfb(resolvesessionbody,usertoken,this.props.fbsessionSelected,this.props.fbsessions,this.props.fbchats);

      //update session status on socket
       //update session status on socket
      socket.emit('updatesessionstatusFB',{'pageid':this.props.fbsessionSelected.pageid.pageid,
                                       'user_id':this.props.fbsessionSelected.user_id.user_id,
                                      'status' : 'resolved',
                                      'room' : this.props.userdetails.uniqueid,
                                      'agentid' : {'id' : this.refs.agentList.options[this.refs.agentList.selectedIndex].dataset.attrib,'type' : 'agent'},

                                     });

     this.forceUpdate();
  }

}
onTestURL(e){
  console.log(e)
  var Video_EXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i;

  var truef = Video_EXTENSIONS.test(e)

  if(truef == false){
    alert('Video File Format not supported. Please download.')
  }

}

onTestURLAudio(e){
  console.log(e)
  var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i;


  var truef = AUDIO_EXTENSIONS.test(e)

  if(truef == false){
    alert('Audio File Format not supported. Please download.')
  }

}
 componentWillUpdate(){
  //this.scrollToTop();
}

componentDidMount(){
 // alert('i am called');
   //workaround for push bottom bar to bottom
    this.setState({
        visible: false,
        showEmojiPicker: false,
        showSticker: false,
        showthisdiv:true,
      });

   setTimeout(() =>{
       this.setState({
        visible: false,
        showEmojiPicker: false,
        showSticker: false,
        showthisdiv:false,
      });
   },0.000001);
  this.scrollToBottom();
}

componentDidUpdate(prevProps){
  if(prevProps.fbsessionSelected.user_id.user_id != this.props.fbsessionSelected.user_id.user_id || prevProps.fbchatSelected.length == this.props.fbchatSelected.length -1 ){
//   alert('i am called');
  //workaround for push bottom bar to bottom
 
    this.setState({
        visible: false,
        showEmojiPicker: false,
        showSticker: false,
        showthisdiv:true,
      });

   setTimeout(() =>{
       this.setState({
        visible: false,
        showEmojiPicker: false,
        showSticker: false,
        showthisdiv:false,
      });
   },0.000001);
   this.scrollToBottom();

  }

  /*if(prevProps.fbchatSelected.length != this.props.fbchatSelected.length && prevProps.senderid != this.props.senderid){
    this.scrollToTop()
  }*/
  //this.scrollToBottom();
  //check if the status of the fbsession is changed
  if((prevProps.fbsessionSelected.agent_ids.length != this.props.fbsessionSelected.agent_ids.length) || (prevProps.fbsessionSelected.user_id.user_id != this.props.fbsessionSelected.user_id.user_id)){

      if(this.props.fbsessionSelected.agent_ids.length > 0 && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type== 'group'){
        //check if the agent is in assigned team
        for(var i=0;i< this.props.teamagents.length;i++){
          if(this.props.teamagents[i].groupid._id == this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id && this.props.teamagents[i].agentid._id == this.props.userdetails._id){

            this.setState({'agentinTeam' : true})
            break;

            }
          }
        }
      }
  }


scrollToBottom() {
    /*const node = ReactDOM.findDOMNode(this.refs['chatmsg'+(this.props.messages.length-1)]);
    console.log(node);
    console.log(node.offsetTop)

    node.parentNode.scrollTop = node.offsetTop + 1100;*/
   // const node = ReactDOM.findDOMNode(this.messagesEnd);
    //node.scrollIntoView({behavior: "smooth"});
    //alert(this.props.fbchatSelected.length-1);
    //console.log(this.refs[this.props.fbchatSelected.length-1])
   // this.refs[this.props.fbchatSelected.length-1].scrollIntoView({behavior: "smooth",block:"end"});
    //alert(this.props.fbchatSelected.length);
    const target = ReactDOM.findDOMNode(this.refs[this.props.fbchatSelected.length-1]);
    target.scrollIntoView({behavior: "smooth"});
   // target.parentNode.scrollTop = target.offsetTop;  
   // console.log(target);
    //node.scrollTop = node.scrollHeight;


}


scrollToTop() {
    const node = ReactDOM.findDOMNode(this.refs.chatmsg0);
    node.parentNode.scrollTop = node.offsetTop - 100;

}


_onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    console.log(e.target.files[0]);

    this.setState({ userfile:e.target.files[0]
                       });

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result,
                       });
      this.onFileSubmit();

    };
    console.log(reader.result);
    reader.readAsDataURL(files[0]);
    


  }
onChange(event, { newValue }) {
    if(newValue.length >= 640){
      this.setState({
        longtextwarning:'Message is exceeding 640 character limit.'
      })
    }
    else{
        this.setState({
        longtextwarning:''
      })
    }
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
handleMessageSubmit(e) {
    const { socket,dispatch } = this.props;
    var sendmessage = true;

    console.log('handleMessageSubmit' + e.which)

    if (e.which === 13 && this.state.value !="") {
      if(this.props.fbsessionSelected.status == "new"){
            this.autoassignChat();
        }
        var index = this.props.fbsessionSelected.agent_ids.length-1
       if(this.props.fbsessionSelected.status == "assigned" && ((this.props.fbsessionSelected.agent_ids[index].id != this.props.userdetails._id && this.props.fbsessionSelected.agent_ids[index].type == 'agent') || (this.state.agentinTeam == false && this.props.fbsessionSelected.agent_ids[index].type == 'group'))){
          sendmessage = confirm('This chat session is already assigned. Do you still wants to proceed?');

        }

     if(sendmessage == true){


      if(this.state.value.length >= 640){
        alert('Message cannot be send. It exceeds 640 character limit');
      }
      else{

      this.setState({
        value: ""
      });
    var today = new Date();
    var uid = Math.random().toString(36).substring(7);

    var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

    var pageid=''
    for(var i=0;i<this.props.messages.length;i++){
      if(this.props.messages[i].senderid == this.props.senderid){
        pageid = this.props.messages[i].recipientid;
        //alert(pageid)
        break;
      }
    }

    var saveMsg = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.senderid,
              companyid:this.props.userdetails.uniqueid,
              timestamp:Date.now(),
              message:{
                mid:unique_id,
                seq:1,
                text:this.state.value,
              },

             pageid:pageid

    }

    this.props.getfbchatfromAgent(saveMsg);

    var data = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.senderid,
              companyid:this.props.userdetails.uniqueid,
              seen:false,
              message:{
                text:this.state.value,
                mid: unique_id,
              },
              inbound:true,
              backColor: '#3d83fa',
              textColor: "white",
              avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
              duration: 0,
              timestamp:Date.now(),


            }
    this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid,this.props.fbsessions,this.props.sessionsortorder);
    socket.emit('broadcast_fbmessage',saveMsg);

   // this.scrollToBottom();
        this.forceUpdate();
      }
    }
  }
    }


onFileSubmit()
    {
        const { socket,dispatch } = this.props;
        var sendmessage = true;
        const usertoken = auth.getToken();
        var fileData = new FormData();
        this.refs.selectFile.value = null;
        console.log('on onFileSubmit');
        console.log(this.state.userfile);
        

      

        if ( this.state.userfile && this.state.userfile != '' ) {

              this.props.updatefileuploadStatus(true);
              if(this.props.fbsessionSelected.status == "new"){
                    this.autoassignChat();
                }
                
              if(this.props.fbsessionSelected.status == "assigned" && (this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id != this.props.userdetails._id && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == 'agent')){
                sendmessage = confirm('This chat session is already assigned. Do you still wants to proceed?');

              }

            if(sendmessage == true){
              console.log(this.state.userfile)
             
              var today = new Date();
              var uid = Math.random().toString(36).substring(7);
              var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
              var pageid=''
              for(var i=0;i<this.props.messages.length;i++){
                if(this.props.messages[i].senderid == this.props.senderid){
                  pageid = this.props.messages[i].recipientid;
                 // alert(pageid)
                  break;
                }
              }
              var saveMsg = {
                              senderid: this.props.userdetails._id,
                              recipientid:this.props.senderid,
                              companyid:this.props.userdetails.uniqueid,
                              timestamp:Date.now(),
                              message:{
                                mid:unique_id,
                                seq:1,
                                attachments:[{
                                  type:this.state.userfile.type.split('/')[0],
                                  payload:{
                                    url:'',
                                  }

                                }]
                              },

                             pageid:pageid

           }


              fileData.append('file', this.state.userfile);
              fileData.append('filename',  this.state.userfile.name);
              fileData.append('filetype',  this.state.userfile.type);
              fileData.append('filesize',  this.state.userfile.size);
              fileData.append('chatmsg', JSON.stringify(saveMsg));
              this.props.uploadFbChatfile(fileData,usertoken,this.props.fbchats,this.props.senderid);
              this.setState({ userfile:''});
              this.forceUpdate();
        }
        }

        else{
          alert('Please choose a file to upload.');
        }
       // this.forceUpdate();
   //     event.preventDefault();

    }

    sendThumbsUp()

        {
          alert('i am called');
           const { socket,dispatch } = this.props;
           var sendmessage = true;
           if(this.props.fbsessionSelected.status == "new"){
            this.autoassignChat();
        }
        if(this.props.fbsessionSelected.status == "assigned" && (this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id != this.props.userdetails._id && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == 'agent')){
          sendmessage = confirm('This chat session is already assigned. Do you still wants to proceed?');

        }

        if(sendmessage == true){

            const usertoken = auth.getToken();
            var today = new Date();
            var uid = Math.random().toString(36).substring(7);
            var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
            var pageid=''
            for(var i=0;i<this.props.messages.length;i++){
                if(this.props.messages[i].senderid == this.props.senderid){
                  pageid = this.props.messages[i].recipientid;
                 // alert(pageid)
                  break;
                }
            }

             var saveMsg = {
                senderid: this.props.userdetails._id,
                recipientid:this.props.senderid,
                companyid:this.props.userdetails.uniqueid,
                timestamp:Date.now(),
                message:{
                  mid:unique_id,
                  seq:1,
                 // sticker_id: 369239263222822,
                  attachments:[{
                    type:'image',
                    payload:{
                      url: `https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&oh=547beb90237e24a9682810a5144c9fba&oe=5988CFDC`,
                   //   sticker_id: 369239263222822,
                    }
                  }]
                },
                pageid:pageid
            }

           console.log(saveMsg);

            this.props.getfbchatfromAgent(saveMsg);

       var data = {
              senderid: this.props.userdetails._id,
              recipientid:this.props.senderid,
              companyid:this.props.userdetails.uniqueid,

              seen:false,
               message:{
                  mid:unique_id,
                  seq:1,
                  attachments:[{
                    type:'image',
                    payload:{
                      url: `https://kiboengage.kibosupport.com/images/thumbsUp.png`,
                    }
                  }]
                },
              inbound:true,
              backColor: '#3d83fa',
              textColor: "white",
              avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
              duration: 0,
              timestamp:Date.now(),


            }
    this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid,this.props.fbsessions,this.props.sessionsortorder)
    socket.emit('broadcast_fbmessage',saveMsg);
  }
    // this.scrollToBottom();

            this.forceUpdate();
            event.preventDefault();

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

toggleEmojiPicker() {

  this.setState({
    visible: false,
    showEmojiPicker: !this.state.showEmojiPicker,
    showSticker: false,
  });
}

validateEmoji() {
  var matched = emojiMap.filter(function(emoji) {
    return `:${emoji.name}:` === this.state.emoji
  })

  if(matched.length === 0) {
    this.setState({emoji: null})
  }
}

updateState(e) {
  this.setState({emoji: e.target.value})
}

setEmoji(emoji) {
  this.setState({
    value: this.state.value + emoji.unicode,
    visible: false,
    showEmojiPicker: false,
    showSticker: false,
  });
}


sendGIF (gif) {
   const { socket,dispatch } = this.props;
   var sendmessage = true;
     if(this.props.fbsessionSelected.status == "new"){
            this.autoassignChat();
        }
     if(this.props.fbsessionSelected.status == "assigned" && (this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id != this.props.userdetails._id && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == 'agent')){
          sendmessage = confirm('This chat session is already assigned. Do you still wants to proceed?');

        }

     if(sendmessage == true){

      this.setState({
        visible: false,
        showEmojiPicker: false,
        showSticker: false,
      });

  const usertoken = auth.getToken();
  var today = new Date();
  var uid = Math.random().toString(36).substring(7);
  var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
  var pageid=''
  for(var i=0;i<this.props.messages.length;i++){
      if(this.props.messages[i].senderid == this.props.senderid){
        pageid = this.props.messages[i].recipientid;
       // alert(pageid)
        break;
      }
  }

  var saveMsg = {
      senderid: this.props.userdetails._id,
      recipientid:this.props.senderid,
      companyid:this.props.userdetails.uniqueid,
      timestamp:Date.now(),
      message:{
        mid:unique_id,
        seq:1,
        attachments:[{
          type:'image',
          payload:{
            url: gif.downsized.url,
          }
        }]
      },
      pageid:pageid
  }

  console.log(saveMsg);

  this.props.getfbchatfromAgent(saveMsg);

var data = {
    senderid: this.props.userdetails._id,
    recipientid:this.props.senderid,
    companyid:this.props.userdetails.uniqueid,

    seen:false,
     message:{
        mid:unique_id,
        seq:1,
        attachments:[{
          type:'image',
          payload:{
            url: gif.downsized.url,
          }
        }]
      },
    inbound:true,
    backColor: '#3d83fa',
    textColor: "white",
    avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
    duration: 0,
    timestamp:Date.now(),


  }
this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid,this.props.fbsessions,this.props.sessionsortorder)
socket.emit('broadcast_fbmessage',saveMsg);
}
// this.scrollToBottom();

  this.forceUpdate();
  event.preventDefault();

}

toggleVisible () {
  this.setState({
    visible: !this.state.visible,
    showEmojiPicker: false,
    showSticker: false,
  });
}

sendSticker(sticker) {
   const { socket,dispatch } = this.props;
   var sendmessage = true;
    if(this.props.fbsessionSelected.status == "new"){
            this.autoassignChat();
        }
   if(this.props.fbsessionSelected.status == "assigned" && (this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].id != this.props.userdetails._id && this.props.fbsessionSelected.agent_ids[this.props.fbsessionSelected.agent_ids.length-1].type == 'agent')){
          sendmessage = confirm('This chat session is already assigned. Do you still wants to proceed?');

        }

  if(sendmessage == true){

  this.setState({
    visible: false,
    showEmojiPicker: false,
    showSticker: false,
  });
  const usertoken = auth.getToken();
  var today = new Date();
  var uid = Math.random().toString(36).substring(7);
  var unique_id = 'f' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
  var pageid=''
  for(var i=0;i<this.props.messages.length;i++){
      if(this.props.messages[i].senderid == this.props.senderid){
        pageid = this.props.messages[i].recipientid;
       // alert(pageid)
        break;
      }
  }

  var saveMsg = {
      senderid: this.props.userdetails._id,
      recipientid:this.props.senderid,
      companyid:this.props.userdetails.uniqueid,
      timestamp:Date.now(),
      message:{
        mid:unique_id,
        seq:1,
        attachments:[{
          type:'image',
          payload:{
            url: sticker.image.hdpi,
          }
        }]
      },
      pageid:pageid
  }

  console.log(saveMsg);

  this.props.getfbchatfromAgent(saveMsg);

var data = {
    senderid: this.props.userdetails._id,
    recipientid:this.props.senderid,
    companyid:this.props.userdetails.uniqueid,

    seen:false,
     message:{
        mid:unique_id,
        seq:1,
        attachments:[{
          type:'image',
          payload:{
            url: sticker.image.hdpi,
          }
        }]
      },
    inbound:true,
    backColor: '#3d83fa',
    textColor: "white",
    avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
    duration: 0,
    timestamp:Date.now(),


  }
this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid,this.props.fbsessions,this.props.sessionsortorder)
socket.emit('broadcast_fbmessage',saveMsg);

// this.scrollToBottom();

  this.forceUpdate();
}
  event.preventDefault();
}

toggleStickerPicker() {
  this.setState({
    visible: false,
    showEmojiPicker: false,
    showSticker: !this.state.showSticker,
  });
  //alert('i am called ' + this.state.showSticker);
  //this.forceUpdate();
}

getMeta(event){
   // alert(event.target.src);
    var img = new Image();
    img.addEventListener("load", function(){
        alert( this.naturalWidth +' '+ this.naturalHeight );
    });
    return this.naturalHeight;
}

render () {
    // only show previous messages if they exist.
    // display messages of active channel
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange: this.onChange,
      className :"form-control input-sm" ,
      placeholder :"Type your message here and press enter to send...",
      onKeyDown :this.handleMessageSubmit,
    };

    let list = this.props.messages.map((data, index) => {
      return (
        
        data.senderid == this.props.senderid?
       <div  key={index} ref={index} id={'chatmsg'+index} style={{'textAlign':'left','clear':'both'}}>
       {/* <div className='message-header'>
          
          <span className='username'>{this.props.username}</span>
        </div>
        
      /*      <div className='message-content' style={{'backgroundColor':'rgba(236, 236, 236, 0.1)', wordWrap: 'break-word'}}>

      }*/}

      { index == 0? 
         <h4 style={styles.timestyle}>{displayDate(data.timestamp)}</h4>:

          index > 0 && showDate(this.props.messages[index-1].timestamp,data.timestamp) == "true"  &&
         <h4 style={styles.timestyle}>{displayDate(data.timestamp)}</h4>
        
      }
      
      <div style={{'float':'left'}}>
             {/* <span className='time'>{handleDate(data.timestamp)}</span> 
              <p className='message-body'>{ ReactEmoji.emojify(data.message) }</p>
             */}
             <img src={this.props.userprofilepic} width="25px" height="25px" style={styles.avatarstyle} />
             <div style={data.attachments && data.attachments.length > 0 && data.attachments[0].type == "image"? styles.left.wrapperNoColor: styles.left.wrapper}>
             <p style={styles.left.text}>{ ReactEmoji.emojify(data.message) }</p>
              {data.attachments && data.attachments.length >0  &&
                 data.attachments.map((da,index) => (
                       (da.type == "image"?
                        (da.payload.url.split("?")[0] == 'https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png'?
                       
                       <img src={da.payload.url}  style={{
                                                          'width':'32px',
                                                          'height':'32px'}}/> :

                       <div style={styles.imagestyle}>
                       <img src={da.payload.url}  style={{
                                                          'maxWidth': '100%',
                                                           'maxHeight': '585px'}}/>
                       </div>
                       )
                      :
                     <div style={styles.imagestyle}>
                      {
                        da.type == "video"?
                        <ReactPlayer url={da.payload.url} controls={true} width="100%" height="242"  onPlay={this.onTestURL.bind(this, da.payload.url)} />:
                        (da.type == "audio"?
                        <ReactPlayer url={da.payload.url} controls={true} width="100%" height="30" onPlay={this.onTestURLAudio.bind(this, da.payload.url)}/>:
                        (da.type == "location"?
                           <div>
                             <p> {da.title} </p>
                             <a href={getmainURL(da.payload)} target="_blank"><img src={geturl(da.payload)}/></a>
                           </div>
                       :
                       <a href={da.payload.url} target="_blank" style={{ 'wordWrap': 'break-word'}}>{da.payload.url.split("?")[0].split("/")[da.payload.url.split("?")[0].split("/").length-1]}  </a>
                       ))
                        }
                        </div>
                      
                       )


                ))
               
              }
              </div>
            </div>
        </div> :
        <div  key={index} ref={index} id={'chatmsg'+index} style={{'textAlign':'right','clear':'both'}}>
         { index == 0? 
         <h4 style={styles.timestyle}>{displayDate(data.timestamp)}</h4>:

          index > 0 && showDate(this.props.messages[index-1].timestamp,data.timestamp) == "true"  &&
         <h4 style={styles.timestyle}>{displayDate(data.timestamp)}</h4>
        
         }
        {
          /*<div className='message-header'>
          <img className='profile-image' src='https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48' width="36px" height="36px"/>
          <span className='username'>{this.props.agents.filter((c) => c._id == data.senderid)[0].firstname + ' ' + this.props.agents.filter((c) => c._id == data.senderid)[0].lastname  }</span>
          </div>
         
            <div className='message-content' style={{'backgroundColor':'rgba(236, 236, 236, 0.1)', wordWrap: 'break-word'}}>
             */
        }
           {
              index == 0?
                   <div style={styles.sendername}>{this.props.agents.filter((c) => c._id == data.senderid)[0].firstname + ' ' + this.props.agents.filter((c) => c._id == data.senderid)[0].lastname  }</div>
              :

              this.props.messages[index-1].senderid != data.senderid  &&
            
               <div style={styles.sendername}>{this.props.agents.filter((c) => c._id == data.senderid)[0].firstname + ' ' + this.props.agents.filter((c) => c._id == data.senderid)[0].lastname  }</div>
             
            }
          <div style={data.attachments && data.attachments.length > 0 && data.attachments[0].type == "image"? styles.right.wrapperNoColor: styles.right.wrapper}>
             {/* <span className='time'>{handleDate(data.timestamp)}</span>
              <p className='message-body'>{ ReactEmoji.emojify(data.message) }</p> */}
             
              <p style={styles.right.text}>{ ReactEmoji.emojify(data.message) }</p>
              {data.attachments && data.attachments.length >0  &&
                 data.attachments.map((da,index) => (
                       (da.type == "image"?
                       (da.payload.url == 'https://kiboengage.kibosupport.com/images/thumbsUp.png'?
                      <div style={styles.imagestyle}>
                       <img src={da.payload.url}  style={{
                                                          'width':'32px',
                                                          'height':'32px'}}/>
                                                        </div> :
                       <div style={styles.imagestyle}>
                       <img src={da.payload.url}  style={{
                                                          'maxWidth': '100%',
                                                           'maxHeight': '585px'}}/>
                                                        </div>
                       )
                        

                                                           :
                      <div style={styles.imagestyle}>
                      (da.type == "video"?
                        <ReactPlayer url={da.payload.url} controls={true} width="100%" height="242"  onPlay={this.onTestURL.bind(this, da.payload.url)} />:
                        (da.type == "audio"?
                        <ReactPlayer url={da.payload.url} controls={true} width="100%" height="30" onPlay={this.onTestURLAudio.bind(this, da.payload.url)}/>:

                        (da.type == "location"?
                       <div>
                       <p> {da.title} </p>
                       <a href={getmainURL(da.payload)} target="_blank"><img src={geturl(da.payload)}/></a>
                       </div> :
                       <a href={da.payload.url} target="_blank" style={{ 'wordWrap': 'break-word'}}>{da.payload.url}  </a>
                       )))
                       </div>
                       )
                ))
              }
             
            </div>
           
           


        </div>

      )
    })


      return (
      
        <div className="anotherflx">
        <div className="headerchatarea">
          <h4> Customer : {this.props.fbsessionSelected.user_id.first_name+' ' + this.props.fbsessionSelected.user_id.last_name}</h4>
          
          <h4> Status : {this.props.fbsessionSelected.status}</h4>
          <br/>
          <div className="table-responsive">
                           <table className="table table-colored">
                           <tbody>
                                      
                     <tr>
                     <td className="col-md-4">


                          <div className="input-group">
                          <select  ref = "agentList" className="form-control" onChange={this.handleChange.bind(this)} aria-describedby="basic-addon3"   >
                                <option value={-1} data-attrib = {-1} data-type = {-1} data-name={-1} data-email={-1}>Select Agent</option>
                                {
                                  this.props.agents && this.props.agents.map((agent,i) =>
                                    <option value={agent.email} data-attrib = {agent._id} data-type = "agent" data-name={agent.firstname} data-email={agent.email}>{agent.firstname +' '+ agent.lastname}</option>

                                    )

                                }

                              </select>


                         </div>
                      </td>

                      <td className="col-md-4">
                        <button className="btn btn-primary" onClick = {this.assignSessionToAgent}> Assign To Agent</button>
                      </td>



                      <td className="col-md-4">
                         <div className="input-group">
                           <select  ref = "teamlist" className="form-control" onChange={this.handleChange.bind(this)}   >
                                          <option value={-1} data-attrib = {-1}>Select Team</option>
                                          {
                                          this.props.teamdetails && this.props.teamdetails.map((team,i) =>
                                            <option value={team._id} data-attrib = {team._id}>{team.groupname}</option>

                                            )
                                         }

                         </select>
                           </div>
                        </td>


                      <td className="col-md-4">
                         <button className="btn btn-primary" onClick = {this.assignSessionToTeam}> Assign To Team</button>
                      </td>

                      <td className="col-md-1">
                        <button className="btn btn-primary" onClick = {this.resolveSession}> Resolved </button>
                      </td>

                      </tr>
                     



                    </tbody>
                  </table>

          </div>
          </div>
        <article ref="messagelist">
         <div>
          {list}
         </div> 
        </article>

        
        <div className="footerchatarea">
          <div style={styles.inputContainer} >
            <div style={styles.inputField}>
                <Autosuggest  ref = "msg" suggestions={suggestions}

                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}



                   inputProps={inputProps} />
            </div>

        
              <ReactTooltip place="bottom" type="dark" effect="solid"/>
              <div style={styles.toolbox}>
                    <div style={{display: 'inline-block'}} data-tip="attachments">
                    
                        <i style={styles.iconclass} onClick = {() => {this.refs.selectFile.click()}}>
                        <i style={{fontSize: '25px', position: 'absolute', left: '0', width: '100%', height: '2.5em', textAlign: 'center'}} className="fa fa-paperclip"></i>
                      </i>
                        <input ref="selectFile" type="file" onChange={this._onChange} style={styles.inputf}/>
                      
                    </div>

                    <div style={{display: 'inline-block'}} data-tip="emoticons">
                      <i style={styles.iconclass}  onClick = {this.toggleEmojiPicker}>
                        <i style={{fontSize: '25px', position: 'absolute', left: '0', width: '100%', height: '2.5em', textAlign: 'center'}} className="fa fa-smile-o"></i>
                      </i>
                    </div>
                      <div style={{display: 'inline-block'}} data-tip="stickers">
                        <i style={styles.iconclass}  onClick = {this.toggleStickerPicker}>
                          <i style={{fontSize: '25px', position: 'absolute', left: '0', width: '100%', height: '2.5em', textAlign: 'center'}} className="fa fa-file-o"></i>
                          <i style={{position: 'absolute', left: '0', width: '100%', textAlign: 'center', fontSize: '15px'}} className="fa fa-smile-o"></i>
                        </i>
                      </div>
                      <div style={{display: 'inline-block'}} data-tip="GIF">
                        <i style={styles.iconclass}  onClick = {this.toggleVisible}>
                          <i style={{fontSize: '25px', position: 'absolute', left: '0', width: '100%', height: '2.5em', textAlign: 'center'}} className="fa fa-file-o"></i>
                          <p style={{position: 'absolute', text: 'GIF', left: '0', width: '100%', textAlign: 'center', fontSize: '10px'}}>GIF</p>
                        </i>
                      </div>


                    <div style={{display: 'inline-block'}} data-tip="Thumbs Up">
                      <i style={styles.iconclass}  >
                        <i style={{fontSize: '25px', color: '#0099e6',position: 'absolute', right: '0', width: '100%', height: '2.5em', textAlign: 'center'}} className="fa fa-thumbs-up" onClick = {this.sendThumbsUp.bind(this)}></i>
                      
                      </i>
                    </div>
           

            </div>
          </div>

              <div>
                    <div style={{'clear':'both','float':'right'}}>
                      {
                          this.state.showEmojiPicker &&
                          <EmojiPicker
                            onEmojiSelected={this.setEmoji}
                          />

                      }

                      {
                        this.state.showSticker &&
                        <div style={{overflow: 'scroll', objectFit: 'contain', height: '300px', width: '670px'}}>
                        <StickerMenu
                          apiKey={'80b32d82b0c7dc5c39d2aafaa00ba2bf'}
                          userId={'imran.shoukat@khi.iba.edu.pk'}
                          sendSticker={this.sendSticker}
                        />
                        </div>
                      }

                      {
                        this.state.showthisdiv &&
                        <div style={{overflow: 'scroll', objectFit: 'contain', height: '300px', width: '670px',backgroundColor:'white',opacity:0.1}}>
                       
                        </div>
                      }
                      {
                        this.state.visible &&
                        <Picker
                          onSelected={this.sendGIF}
                        />

                      }
              </div>
              
          </div>


              {
                      this.props.showFileUploading && this.props.showFileUploading == true &&
                     <p style={{color:'red'}}>Uploading file...Please wait</p>
                     
              } 
              {
                this.state.longtextwarning != '' &&
              <p style={{'color':'red'}}>{this.state.longtextwarning}</p>
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
      clear:'both',
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
      marginLeft: '1em',
      position: 'relative',
      display: 'inline-block',
    },

    wrapperNoColor: {
      borderRadius: 15,
      minHeight: 20,
      justifyContent: 'flex-end',
      marginBottom: 15,
      boxSizing: 'border-box',
      maxWidth: '80%',
      clear:'both',
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .1)',
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

    wrapperNoColor: {
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
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  timestyle:{
    clear:'both',
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
  imagestyle:{
    textAlign:'center',
    padding:10,
  },
   sendername:{
   
    position: 'relative',
    float: 'right',
    width: '100%',
    marginTop: '-10px',
    fontSize: 10,
    color: '#676161',
    marginBottom:10,
  },
  avatarstyle:{
    borderRadius: '5px',
    /* float: left; */
    display: 'inline-block',
  },

  inputContainer:{
    display: 'table',
    margin: '0px 0px',
    width: '100%',
    borderBottom: '1px solid #dddfe2',
    borderTop: '1px solid #dddfe2',
    minHeight: 50,
    position: 'relative',

  },
  inputField:{
    minHeight: 30,
    verticalAlign: 'middle',
    width: '100%',
    padding: '15px 10px',
    height:24,
  },
  toolbox:{
    display: 'table-cell',
    width: 100,
    padding: '0px 0',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
  },

  element:{
  display: 'inline-block',
  alignItems: 'center',
},
 
 faicon: {
  margin: 10,
  cursor: 'pointer',
  fontSize: 30,
},
inputf:{
  display: 'none',
},

iconclass:{
    height: 24,
    padding: '0 15px',
    width: 24,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
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
          customerchatold :(state.dashboard.customerchatold),
          chatlist :(state.dashboard.chatlist),
          channels :(state.dashboard.channels),
          customers:(state.dashboard.customers),
          customerchat_selected :(state.dashboard.customerchat_selected),
          new_message_arrived_rid :(state.dashboard.new_message_arrived_rid),
          userchats :(state.dashboard.userchats),
          responses :(state.dashboard.responses),
          onlineAgents:(state.dashboard.onlineAgents),
          yoursocketid :(state.dashboard.yoursocketid),
          mobileuserchat : (state.dashboard.mobileuserchat),
          serverresponse : (state.dashboard.serverresponse) ,
          groupagents : (state.dashboard.groupagents),
          groupdetails :(state.dashboard.groupdetails),
          teamagents : (state.dashboard.teamagents),
          fbcustomers:state.dashboard.fbcustomers,
          fbchats:state.dashboard.fbchats,
          fbchatSelected:state.dashboard.fbchatSelected,
          fbsessionSelected:state.dashboard.fbsessionSelected,
          status:state.dashboard.status,
          showFileUploading: state.dashboard.showFileUploading,
          sessionsortorder:state.dashboard.sessionsortorder,
                    };
}

export default connect(mapStateToProps,{updatefileuploadStatus,getfbchatfromAgent,add_socket_fb_message,resolvesessionfb,uploadFbChatfile,createnews,assignToAgentFB})(ChatArea);
