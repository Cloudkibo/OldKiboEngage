import React, { Component } from 'react'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest';
//import { fetchMessages } from '../Actions/messages'
import ReactEmoji from 'react-emoji'
 var messages = [{
  message:'How do I use this messaging app?',
  user:{
    name:'Zarmeen',
    imageURL: "https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512",

  },
  time : Date.now(),

}];

var handleDate = function(d){
if(d){
var c = new Date(d);
//alert(c)
return c.toDateString();
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

        };
       this.onChange = this.onChange.bind(this);
        this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);

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
handleMessageSubmit(e) {
    console.log('handleMessageSubmit' + e.which)
    if (e.which === 13 && this.state.value !="") {

    this.props.messages.push({
              message:this.state.value,
              inbound:true,
              backColor: '#3d83fa',
              textColor: "white",
              avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0446T0T5-g0e0ac15859d-48',
              duration: 0,
              timestamp:Date.now(),
            })
        this.forceUpdate();
      }
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
          <img className='profile-image' src={data.avatar} width="36px" height="36px"/>
          <span className='username'>{this.props.username}</span>
          </div>
            <div className='message-content' style={{'backgroundColor':'rgba(236, 236, 236, 0.1)'}}>
              
              <span className='time'>{handleDate(data.timestamp)}</span>
              <p className='message-body'>{ ReactEmoji.emojify(data.message) }</p>
            </div>
        </div> :
        <div className='message clearfix' key={index}>
        <div className='message-header'>
          <img className='profile-image' src={data.avatar} width="36px" height="36px"/>
          <span className='username'>KiboEngage</span>
          </div>
            <div className='message-content' style={{'backgroundColor':'rgba(236, 236, 236, 0.1)'}}>
              
              <span className='time'>{handleDate(data.timestamp)}</span>
              <p className='message-body'>{ ReactEmoji.emojify(data.message) }</p>
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


export default ChatArea
// inject dispatch and listen to store
