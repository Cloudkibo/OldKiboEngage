import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import CopyToClipboard from 'react-copy-to-clipboard';
import AlertContainer from 'react-alert'

class Widget extends Component {

  

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }

     const usertoken = auth.getToken();
     console.log('componentWillMount is called');
     super(props, context);

   
    

  }

   

  render() {
    const token = auth.getToken()
    console.log(token)

    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
        

         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
            <AlertContainer ref={a => this.msg = a}  offset={14} position= 'bottom right' theme='light' time={5000} transition='scale' />

              <div className=" uk-text-center" style={{color: 'black'}}>
                  <img src="https://winnerweb.com.br/assets/images/home/icons/cpanel.png" alt="widget_intro_image" style={{maxWidth:150, maxHeight:150, padding:0, margin: 0}}/>
                  <h2 className="uk-card-title uk-align-center" style={{ fontSize:35}}>Add KiboEngage Widget</h2>
                  <p className="uk-align-center" style={{fontSize: 15}}>{"To embed the widget on your website, you need to put this line before </head> tag or before </body> tag of HTML of your website's each page."}</p>
                  <div className="uk-alert-danger" style={{padding: 5, fontSize: 15, marginTop:-10}} ref={node => node && node.setAttribute('uk-alert', '')}> &lt;script src='https://kiboengage.kibosupport.com/scripts/widgetapp.js' &gt; &lt;/script&gt;</div>
                    <CopyToClipboard text={"<script src='https://kiboengage.kibosupport.com/scripts/widgetapp.js' ></script>"}
                    onCopy={() => this.setState({copied: true})}>
                    <button  onClick={() => {this.msg.success('Copied!!!')}} className="uk-button uk-button-small uk-button-primary" style={{margin:5}}>Copy</button>
                  </CopyToClipboard>
                  

          <p className="uk-align-center" style={{fontSize: 15}}>{"Then you must have to put a button on your page with our onclick function. Example of button is given below."}</p>
                  <div className="uk-alert-danger" style={{padding: 5, fontSize: 15, marginTop:-10}} ref={node => node && node.setAttribute('uk-alert', '')}>&lt;button onclick="loadKiboEngageWidget('{this.props.userdetails.uniqueid}')"&gt; Live Help &lt;/button&gt;</div>
                   <CopyToClipboard text={"<button onclick=\"loadKiboEngageWidget('"+ this.props.userdetails.uniqueid +"')\"> Live Help </button>"}
                    onCopy={() => this.setState({copied: true})}>
                    <button onClick={() => {this.msg.success('Copied!!!')}} className="uk-button uk-button-small uk-button-primary" style={{margin:5}}>Copy</button>
                  </CopyToClipboard>
                   

              <p className="uk-align-center" style={{fontSize: 15}}>Note: You can use any css desgin for the button. You can also use &lt;a&gt; tag if you don't want button.
                        Just remember to do the function call as shown above.<br/>The&nbsp;<b>onclick="loadKiboWidget('{this.props.userdetails.uniqueid}')&nbsp;</b>contains your unique client id. Never alter this function and its value.</p>

              </div>
                 
           
          
           </div>           

        
       </div>
      </div>
      </div>
      
  )
  }
}

function mapStateToProps(state) {

  return {
  userdetails:(state.dashboard.userdetails),
  agents:(state.dashboard.agents),
  deptagents:(state.dashboard.deptagents),
  teamdetails:(state.dashboard.teamdetails),
  channels :(state.dashboard.channels),
  onlineAgents:(state.dashboard.onlineAgents),
  news : (state.dashboard.news),

   }
}

export default connect(mapStateToProps)(Widget);
