import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import PopoutWindow from 'react-popout';
import Popout from 'react-popout';

class Signup extends Component {

  constructor(props, context) {

    //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    console.log('not verified');
      browserHistory.push('/notverified');
    }

    const usertoken = auth.getToken();
    //console.log('componentWillMount is called');
    super(props, context);
  }

  render() {
    const token = auth.getToken()
    //console.log(token)

    return (
    

    
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">User Guide </h3>
              <ul className="uk-breadcrumb">
                <li>
                  <i className="fa fa-home"/>
                  <Link to="//userDocumentation/MainPage"> Dashboard </Link>
                </li>
                <li>
                  <Link to="/userDocumentation" target="_blank">User Guide</Link>
                </li>
                <li>
                  <Link to="/userDocumentation/Signup" >InviteAgents</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
                <h1>Invite Agents</h1>

							<p>The first step to taking advantage on Kibo Engage features will be to invite Agents into your company. These Agents will work to provide assistance to your customers.</p>

							<p>To add a new agent, click on the &quot;Agents&quot; tab on the left hand side and select &quot;Invite Agents&quot; button.</p>

							
                                <img src="../../documentationPics/Agents.png" style={{width: '800px'}}></img>
                                <br /><br />

							<p>There are two ways you can invite an agent:</p>

								<ol>
								<li>by sharing a link given on the page along with a unique id</li>
								<li>by inviting them to join the company using their email address</li>
							</ol>

 							
                                <img src="../../documentationPics/inviteAgents.png" style={{width: '800px'}}></img>
                                <br /><br />

							<p>Lets say you want to invite an agent with email address &quot;xyz@gmail.com&quot;. This email will be used by the agent for logging in. Ideally, this will be their work email since they will be corresponding with customers using this email</p>


                    
                 
             
            </div>

          </div>
           <div class="col-md-3">

             <div class="sidebar-nav-fixed pull-right affix">
               
                <br/>
                <h3><b>&nbsp; More Related Articles &nbsp;</b></h3>
                    <ul class="nav ">
                        
                       
                        <li><h5><a href="#">Assign Agents</a></h5>
                        </li>
                        <li><h5><a href="#">Create Groups</a></h5>
                        </li>
                        <li><h5><a href="#">Create Sub Groups</a></h5>
                        </li>
                    </ul>
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

export default connect(mapStateToProps)(Signup);
