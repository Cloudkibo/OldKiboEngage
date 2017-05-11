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
            <Link to='/features' className="dropdown-toggle">
              Features
            </Link>
            </li>
            <li className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" data-target="#" href="javascript:;">
                About Us
              </a>
            </li>
            <li className="dropdown">
            <Link to='/privacypolicy' className="dropdown-toggle">
              Privacy Policy
            </Link>
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
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-comments text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Live Chat</h3>
            <p className="text-muted">Instant chat feature allows your visitors to
            initiate a chat and communicate with your agents.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-users text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Customer Directory</h3>
            <p className="text-muted">Agents would have directory of previous customers or visitors.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-bell text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Notifications</h3>
            <p className="text-muted">Notifications are the messages broadcasted
            from Agents to all customers.Agent can send information related to new
            offers,product launch and other advertisements to customers.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-database text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Canned Repsonses</h3>
            <p className="text-muted">Typing same thing over and
            over may bore them and reduce their productivity. To keep things up
            for your agents and maintain their pace, you can create well-formatted
            - predetermined responses for commonly asked questions.</p>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="row">
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-envelope-square text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Sub Groups</h3>
            <p className="text-muted">Subgroups are topical conversation threads within
            the inbox. Sub group is assigned to Group.A group can have more than one sub group.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-users text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Groups</h3>
            <p className="text-muted">Groups are the organizational units like IT,
            Customer Support ,Sales e.t.c with in a Company.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-phone-square text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Personalized Calls</h3>
            <p className="text-muted">Client can have option to decide which support
            agent he wants to talk to.Clients can choose specific agent to discuss their issue.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-user text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Agent Management</h3>
            <p className="text-muted">KiboEngage enables Agent Management.You can
            invite agents and can manange their roles</p>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="row">
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-bar-chart text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Reports</h3>
            <p className="text-muted">Bring focus on work performed by agents and
            teams, agent response time, call statistic, group traffic to get the
            insights. Analytics plays a huge role in customer service. Quality reports
            helps you to stay on target.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-link text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Widget on Website</h3>
            <p className="text-muted">Each company has its own unique identity. Easy way
            to embed widget code and connect with you customer.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-phone text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Audio/Video Call</h3>
            <p className="text-muted">Live call with your customer helps to have live
            conversation with your customer and understand their problems and solve
            them. Customer can just fill a form and join agent in the call.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-desktop text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Screen sharing</h3>
            <p className="text-muted">Screen sharing feature helps you to direct your
            visitor directly to the answer they have been looking for, instead of trying
             to explain where to find the answer.</p>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="row">
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-facebook-official text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Integration with Facebook Messenger</h3>
            <p className="text-muted">Companies can now easily integrate their KiboEngage
            Dashboard with their Facebook Page to communicate effectively with customers on Facebook</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-user text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Role Based Access</h3>
            <p className="text-muted">Exercise fine grained access control to features
            by assigning specific roles to agents in your organization.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 text-center">
          <div className="service-box">
            <i style={{fontSize: 40, color: '#F05F40'}} className="fa fa-envelope text-primary sr-icons"></i>
            <br></br><br></br>
            <h3>Rich Messaging</h3>
            <p className="text-muted">Make conversations more friendly with rich messages. Agents
            can respond to user queries with images, GIFs, emoticons, stickers, videos and
            deep-links to provide a truly exciting experience.</p>
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
