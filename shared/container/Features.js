import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';

class Features extends Component {
  constructor(props, context) {
       super(props, context);
       this.handleClick = this.handleClick.bind(this);
       this.handleBotClick = this.handleBotClick.bind(this);
  }

  handleClick(e){
    e.preventDefault();
    loadKiboEngageWidget('cd89f71715f2014725163952')
  }

  handleBotClick(e){
    e.preventDefault();
    loadKiboEngageBotWidget('cd89f71715f2014725163952')
  }

  render() {
    return (
      <div className="corporate">
        <div className="pre-header">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-sm-6 additional-shop-info">
                <ul className="list-unstyled list-inline">
                  <li><i className="fa fa-phone"></i><span>1-425-890-9414</span></li>
                  <li><i className="fa fa-envelope-o"></i><span>support@cloudkibo.com</span></li>
                  <li><button onClick={this.handleClick}> Live Help </button></li>
                  <li><button onClick={this.handleBotClick}> Chat Bot Help </button></li>
                </ul>
              </div>
              <div className="col-md-6 col-sm-6 additional-nav">
                <ul className="list-unstyled list-inline pull-right">
                  <li>
                    <Link to='/login'> Login </Link>
                  </li>
                  <li>
                    <Link to='/signup'> Signup </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    <div className="header">
      <div className="container">
        <Link to="/" className ="site-logo"> KiboEngage</Link>
        <div className="header-navigation pull-right font-transform-inherit">
          <ul>
            <li className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
              Home
              </a>
            </li>
            <li className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                Features
              </a>
            </li>
            <li className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                About Us
              </a>
            </li>
            <li className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                Developers
              </a>
            </li>
            <li className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                Contact Us
              </a>
            </li>
            <li className="dropdown dropdown-megamenu">
              <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                User Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="row">
        <div className="col-lg-12 text-center">
          <h2 style={{marginTop: 0}} className="section-heading">Features</h2>
          <center><hr style={{borderColor: '#F05F40', borderWidth: '3px', maxWidth: '50px'}} className="primary" /></center>
        </div>
      </div>
    </div>
    <div className ="container">
      <div className="row">
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-phone-square text-primary sr-icons"></i>
            <h3>Live Communication</h3>
            <p className="text-muted">Instant chat, make audio call, share screen
            to communicate the problem and solve them live.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-users text-primary sr-icons"></i>
            <h3>Agent Groups</h3>
            <p className="text-muted">Use agent groups to better organize teams in
             your organization and automate conversation assignment to relevant groups.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-envelope-square text-primary sr-icons"></i>
            <h3>Sub Groups</h3>
            <p className="text-muted">Categorize conversations into subgroups and
             route your customers to the right groups.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-user text-primary sr-icons"></i>
            <h3>Role Based Access</h3>
            <p className="text-muted">Exercise fine grained access control to features
             by assigning specific roles to users in your organization.</p>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="row">
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-bell text-primary sr-icons"></i>
            <h3>Push Notifications</h3>
            <p className="text-muted">Ensure that users get alerted when you respond
             to them, even if they aren’t actively using your app.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-location-arrow text-primary sr-icons"></i>
            <h3>Optimized UI</h3>
            <p className="text-muted">Empower your agents with our interface that
             is optimized for messaging. Bulk actions, short codes, fast conversation
              switching, and other features help agents respond faster. Real time
              updates to conversations allow your agents to multitask and prioritize
              issues, boosting agent productivity.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-list-alt text-primary sr-icons"></i>
            <h3>Bulk Actions</h3>
            <p className="text-muted">Manage different queries and respond to them in
            a single action. You can assign multiple conversations to agents or groups,
            update the status, and even reply in bulk.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-database text-primary sr-icons"></i>
            <h3>Canned Response</h3>
            <p className="text-muted">Set up pre-formatted response templates to answer
            common questions, saving your agents the trouble of typing the same thing over and over.</p>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="row">
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-comment text-primary sr-icons"></i>
            <h3>Rich Messaging</h3>
            <p className="text-muted">Make conversations more friendly with rich messages.
            Agents can respond to user queries with images and deep-links to provide a truly
            mobile experience.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-file-code-o text-primary sr-icons"></i>
            <h3>Short Code</h3>
            <p className="text-muted">Create short codes for commonly used phrases, for
            agents to access them rapidly. For example, typing /hand  will convert into
            “Have a nice day.”</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-facebook text-primary sr-icons"></i>
            <h3>Facebook Integration</h3>
            <p className="text-muted">Start engaging with your customers on Facebook
            by bringing your knowledge base and forums to your Facebook fans with
            the Facebook Page tab. </p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-bar-chart text-primary sr-icons"></i>
            <h3>Reports</h3>
            <p className="text-muted">View reports on performance by agents and teams,
             agent response time, call statistic, team traffic to get the insights.</p>
          </div>
        </div>
      </div>
    </div>
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-6 padding-top-10">
            2014-2017 © KiboEngage. ALL Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  </div>
    );
  }
}

export default Features;
