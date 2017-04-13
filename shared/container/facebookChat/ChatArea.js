import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest';
import { getfbchatfromAgent,add_socket_fb_message ,uploadFbChatfile} from '../../redux/actions/actions'
import ReactEmoji from 'react-emoji'
import { Link } from 'react-router';
import auth from '../../services/auth';
import Picker from 'react-giphy-picker';
import StickerMenu from 'react-stickerpipe';
import EmojiPicker from 'react-emojipicker';

var emojiMap = require('react-emoji-picker/lib/emojiMap');
import { FileUpload } from 'redux-file-upload'

var handleDate = function(d){
if(d){

var c = new Date(Number(d));
//alert(c)
return c.getHours() + ':' + c.getMinutes()+ ' ' + c.toDateString();
}
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
        this.log = this.log.bind(this);
        this.toggleVisible = this.toggleVisible.bind(this);
        this.toggleStickerPicker = this.toggleStickerPicker.bind(this);
        this.sendSticker = this.sendSticker.bind(this);
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
    };
    console.log(reader.result);
    reader.readAsDataURL(files[0]);
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
handleMessageSubmit(e) {

    console.log('handleMessageSubmit' + e.which)
    if (e.which === 13 && this.state.value !="") {
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
    this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid)

        this.forceUpdate();
      }
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
        }
        this.forceUpdate();
        event.preventDefault();

    }

    sendThumbsUp()
        {
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
                      url: `https://kiboengage.kibosupport.com/images/thumbsUp.png`,
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
    this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid)


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
  console.log(emoji.unicode);
  this.setState({value: this.state.value + emoji.unicode})
}


log (gif) {
  console.log(gif)
  this.setState({enteredGif: gif})
}

toggleVisible () {
  this.setState({
    visible: !this.state.visible,
    showEmojiPicker: false,
    showSticker: false,
  });
}

sendSticker(sticker) {
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
this.props.add_socket_fb_message(data,this.props.fbchats,this.props.senderid)


  this.forceUpdate();
  event.preventDefault();
}

toggleStickerPicker() {
  this.setState({
    visible: false,
    showEmojiPicker: false,
    showSticker: !this.state.showSticker,
  });
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
        <div className='message clearfix' key={index}>
        <div className='message-header'>
          <img className='profile-image' src='https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512' width="36px" height="36px"/>
          <span className='username'>{this.props.username}</span>
          </div>
            <div className='message-content' style={{'backgroundColor':'rgba(236, 236, 236, 0.1)'}}>

              <span className='time'>{handleDate(data.timestamp)}</span>
              <p className='message-body'>{ ReactEmoji.emojify(data.message) }</p>

              {data.attachments && data.attachments.length >0  &&
                 data.attachments.map((da,index) => (
                       (da.type == "image"?
                       <img src={da.payload.url} className='file-preview'/>:
                       <a href={da.payload.url} target="_blank">{da.payload.url}  </a>
                       )
                ))
              }

            </div>
        </div> :
        <div className='message clearfix' key={index}>
        <div className='message-header'>
          <img className='profile-image' src='https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48' width="36px" height="36px"/>
          <span className='username'>KiboEngage</span>
          </div>
            <div className='message-content' style={{'backgroundColor':'rgba(236, 236, 236, 0.1)'}}>

              <span className='time'>{handleDate(data.timestamp)}</span>
              <p className='message-body'>{ ReactEmoji.emojify(data.message) }</p>
              {data.attachments && data.attachments.length >0  &&
                 data.attachments.map((da,index) => (
                       (da.type == "image"?
                       <img src={da.payload.url} className='file-preview'/>:
                       <a href={da.payload.url} target="_blank">{da.payload.url}  </a>
                       )
                ))
              }
            </div>
        </div>

      )
    })


      return (
        <div>
        <div id='messages-container'>
          {list}
        </div>

         <div className="panel-footer">

          <div style={{display: 'inline-block', width: '94%'}}>
                  <Autosuggest  ref = "msg" suggestions={suggestions}

                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}



                   inputProps={inputProps} />
            </div>
            <div className="pull-right" style={{display: 'inline-block', paddingTop: '4px'}}>
              <i style={{fontSize: '30px', color: '#0099e6', cursor: 'pointer'}} className="fa fa-thumbs-up" onClick = {this.sendThumbsUp} ></i>
            </div>
            <br />
            <br />
            <div>
            <div style={{display: 'inline-block'}}>
              <i style={{position: 'relative', display: 'inline-block', width: '2em', height: '2.5em', cursor: 'pointer'}} onClick = {this.toggleEmojiPicker}>
                <i style={{fontSize: '25px', position: 'absolute', left: '0', width: '100%', height: '2.5em', textAlign: 'center'}} className="fa fa-smile-o"></i>
              </i>
            </div>
              <div style={{display: 'inline-block'}}>
                <i style={{position: 'relative', display: 'inline-block', width: '2em', height: '2.5em', cursor: 'pointer'}} onClick = {this.toggleStickerPicker}>
                  <i style={{fontSize: '25px', position: 'absolute', left: '0', width: '100%', height: '2.5em', textAlign: 'center'}} className="fa fa-file-o"></i>
                  <i style={{position: 'absolute', left: '0', width: '100%', textAlign: 'center', fontSize: '15px'}} className="fa fa-smile-o"></i>
                </i>
              </div>
              <div style={{display: 'inline-block'}}>
                <i style={{position: 'relative', display: 'inline-block', width: '2em', height: '2.5em', cursor: 'pointer'}} onClick = {this.toggleVisible}>
                  <i style={{fontSize: '25px', position: 'absolute', left: '0', width: '100%', height: '2.5em', textAlign: 'center'}} className="fa fa-file-o"></i>
                  <p style={{position: 'absolute', text: 'GIF', left: '0', width: '100%', textAlign: 'center', fontSize: '10px'}}>GIF</p>
                </i>
              </div>
            </div>



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
              this.state.visible &&
              <Picker
                onSelected={this.log}
              />

            }

                </div>


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
                       <input type="file" onChange={this._onChange} className="pull-left"/>

                         <button onClick={ this.onFileSubmit } ref="submitbtn" className="pull-right btn green pull-right" >
                            Upload
                          </button>
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

          fbcustomers:state.dashboard.fbcustomers,
          fbchats:state.dashboard.fbchats,
          fbchatSelected:state.dashboard.fbchatSelected,
          status:state.dashboard.status,
                    };
}

export default connect(mapStateToProps,{getfbchatfromAgent,add_socket_fb_message,uploadFbChatfile})(ChatArea);
