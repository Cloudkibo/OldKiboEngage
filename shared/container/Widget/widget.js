import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'

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
              <h3 className ="page-title">Widget </h3>
                 <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/>
                  </li>
                  <li>
                               <Link to="/widget">Widget</Link>
                  </li>

            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                    Widget
                </div>
              </div>
          <div className="portlet-body">
                  <div className="note note-success">
                        <h4 className="block">Code for client site</h4>
                        To embed the widget on your website, you need to put this line before &lt;/head&gt; tag or
                        before &lt;/body&gt; tag of HTML of your website's each page.
                        <br/><br/>
                        <center><code className="codeBox">
                            &lt;script src='https://kiboengage.kibosupport.com/scripts/widgetapp.js' &gt; &lt;/script&gt;
                                </code>
                        </center>
                        <br/>Then you must have to put a button on your page with our onclick function. Example of button is given below.<br/><br/>
                       <center>
                          <code className="codeBox">&lt;button onclick="loadKiboEngageWidget('{this.props.userdetails.uniqueid}')"&gt; Live Help &lt;/button&gt;
                          </code>
                        </center><br/>
                        Note: You can use any css desgin for the button. You can also use &lt;a&gt; tag if you don't want button.
                        Just remember to do the function call as shown above.<br/>The&nbsp;<b>onclick="loadKiboWidget('{this.props.userdetails.uniqueid}')&nbsp;</b>contains your unique client id. Never alter this function and its value.<br/>
            </div>
          </div>
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
