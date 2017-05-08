import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';

class Intro extends Component {
  constructor(props, context) {
       super(props, context);
       this.handleClick = this.handleClick.bind(this);
       this.handleBotClick = this.handleBotClick.bind(this);
    
  }

handleClick(e){
  //alert('i am clicked');
  e.preventDefault();
  loadKiboEngageWidget('cd89f71715f2014725163952')
}

handleBotClick(e){
  //alert('i am clicked');
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

      <div className="page-slider margin-bottom-40">
      <div className="fullwidthbanner-container revolution-slider">
        <div className="fullwidthabnner">
          <ul id="revolutionul">
            <li data-transition="fade" data-slotamount="8" data-masterspeed="700" data-delay="9400" data-thumb="../../assets/frontend/pages/img/revolutionslider/thumbs/thumb2.jpg">
              <img src="../../assets/frontend/pages/img/revolutionslider/bg9.jpg" alt=""/>
              
              <div className="caption lft slide_title_white slide_item_left"
                data-x="30"
                data-y="90"
                data-speed="400"
                data-start="1500"
                data-easing="easeOutExpo">
                HELP CUSTOMER<br/><span className="slide_title_white_bold">ON YOUR WEBSITE</span>
              </div>
              <div className="caption lft slide_subtitle_white slide_item_left"
                data-x="87"
                data-y="245"
                data-speed="400"
                data-start="2000"
                data-easing="easeOutExpo">
                Dealing with incoming call requests from any customer
              </div>
              <Link className="caption lft btn dark slide_btn slide_item_left" to="/signup"
                data-x="187"
                data-y="315"
                data-speed="400"
                data-start="3000"
                data-easing="easeOutExpo">
                Sign Up Now
              </Link>                        
              <div className="caption lfb"
                data-x="640" 
                data-y="0" 
                data-speed="700" 
                data-start="1000" 
                data-easing="easeOutExpo">
                <img src="../../assets/frontend/pages/img/revolutionslider/lady.png" alt="Image 1"/>
              </div>
            </li>    

            <li data-transition="fade" data-slotamount="8" data-masterspeed="700" data-delay="9400" data-thumb="../../assets/frontend/pages/img/revolutionslider/thumbs/thumb2.jpg">
              <img src="../../assets/frontend/pages/img/revolutionslider/bg1.jpg" alt=""/>
                            
              <div className="caption lft slide_title slide_item_left"
                data-x="30"
                data-y="105"
                data-speed="400"
                data-start="1500"
                data-easing="easeOutExpo">
                Solve Problem in Real Time
              </div>
              <div className="caption lft slide_subtitle slide_item_left"
                data-x="30"
                data-y="180"
                data-speed="400"
                data-start="2000"
                data-easing="easeOutExpo">
                Live Interaction with Agent
              </div>
              <div className="caption lft slide_desc slide_item_left"
                data-x="30"
                data-y="220"
                data-speed="400"
                data-start="2500"
                data-easing="easeOutExpo">
                Reach more customers by easily managing multiple Kibosupport communication features<br/> Make teams to reach diversity of customer questions
              </div>
              <Link className="caption lft btn green slide_btn slide_item_left" to="/signup"
                data-x="30"
                data-y="290"
                data-speed="400"
                data-start="3000"
                data-easing="easeOutExpo">
                Signup Now
              </Link>                        
              <div className="caption lfb"
                data-x="640" 
                data-y="55" 
                data-speed="700" 
                data-start="1000" 
                data-easing="easeOutExpo">
                <img src="../../assets/frontend/pages/img/revolutionslider/man-winner.png" alt="Image 1" />
              </div>
            </li>
            <li data-transition="fade" data-slotamount="8" data-masterspeed="700" data-delay="9400" data-thumb="../../assets/frontend/pages/img/revolutionslider/thumbs/thumb2.jpg">
                         
                            <img src="../../assets/frontend/pages/img/revolutionslider/bg4.jpg" alt="" />                        
                             <div className="caption lft slide_title"
                                 data-x="30"
                                 data-y="105"
                                 data-speed="400"
                                 data-start="1500"
                                 data-easing="easeOutExpo">
                                 Responsive call Support
                            </div>
                            <div className="caption lft slide_subtitle"
                                 data-x="30"
                                 data-y="180"
                                 data-speed="400"
                                 data-start="2000"
                                 data-easing="easeOutExpo">
                                 Watch your agent in call
                            </div>
                            <div className="caption lft slide_desc"
                                 data-x="30"
                                 data-y="225"
                                 data-speed="400"
                                 data-start="2500"
                                 data-easing="easeOutExpo">
                                Share your screen with agent to direct you rightly<br/> Send any file to your customer
                            </div>
                            <a className="caption lft slide_btn btn red slide_item_left" href="http://www.keenthemes.com/preview/index.php?theme=metronic_admin" target="_blank" 
                                 data-x="30"
                                 data-y="300"
                                 data-speed="400"
                                 data-start="3000"
                                 data-easing="easeOutExpo">
                                 Learn More!
                            </a>                        
                            <div className="caption lft start"  
                                 data-x="670" 
                                 data-y="55" 
                                 data-speed="400" 
                                 data-start="2000" 
                                 data-easing="easeOutBack"  >
                                 <img src="../../assets/frontend/pages/img/revolutionslider/iphone_left.png" alt="Image 2" />
                            </div>
                            
                            <div className="caption lft start"  
                                 data-x="850" 
                                 data-y="55" 
                                 data-speed="400" 
                                 data-start="2400" 
                                 data-easing="easeOutBack"  >
                                 <img src="../../assets/frontend/pages/img/revolutionslider/iphone_right.png" alt="Image 3" />
                            </div>                        
                        </li>

            <li data-transition="fade" data-slotamount="7" data-masterspeed="300" data-delay="9400" data-thumb="../../assets/frontend/pages/img/revolutionslider/thumbs/thumb2.jpg">                        
              <img src="../../assets/frontend/pages/img/revolutionslider/bg2.jpg" alt="" />
              <div className="caption lfl slide_title slide_item_left"
                data-x="30"
                data-y="125"
                data-speed="400"
                data-start="3500"
                data-easing="easeOutExpo">
                What Else Included
              </div>
              <div className="caption lfl slide_subtitle slide_item_left"
                data-x="30"
                data-y="200"
                data-speed="400"
                data-start="4000"
                data-easing="easeOutExpo">
                Analytics and Graphs
              </div>
              <div className="caption lfl slide_desc slide_item_left"
                data-x="30"
                data-y="245"
                data-speed="400"
                data-start="4500"
                data-easing="easeOutExpo">
                Analytics plays a huge role in customer service<br/>Visualize your trends
              </div>                        
              <div className="caption lfr slide_item_right" 
                data-x="635" 
                data-y="105" 
                data-speed="1200" 
                data-start="1500" 
                data-easing="easeOutBack">
                <img src="../../assets/frontend/pages/img/revolutionslider/mac.png" alt="Image 1" />
              </div>
              <div className="caption lfr slide_item_right" 
                data-x="580" 
                data-y="245" 
                data-speed="1200" 
                data-start="2000" 
                data-easing="easeOutBack">
                <img src="../../assets/frontend/pages/img/revolutionslider/ipad.png" alt="Image 1" />
              </div>
              <div className="caption lfr slide_item_right" 
                data-x="735" 
                data-y="290" 
                data-speed="1200" 
                data-start="2500" 
                data-easing="easeOutBack">
                <img src="../../assets/frontend/pages/img/revolutionslider/iphone.png" alt="Image 1" />
              </div>
              <div className="caption lfr slide_item_right" 
                data-x="835" 
                data-y="230" 
                data-speed="1200" 
                data-start="3000" 
                data-easing="easeOutBack">
                <img src="../../assets/frontend/pages/img/revolutionslider/macbook.png" alt="Image 1" />
              </div>
              <div className="caption lft slide_item_right" 
                data-x="865" 
                data-y="45" 
                data-speed="500" 
                data-start="5000" 
                data-easing="easeOutBack">
                <img src="../../assets/frontend/pages/img/revolutionslider/hint1-red.png" id="rev-hint1" alt="Image 1" />
              </div>                        
              <div className="caption lfb slide_item_right" 
                data-x="355" 
                data-y="355" 
                data-speed="500" 
                data-start="5500" 
                data-easing="easeOutBack">
                <img src="../../assets/frontend/pages/img/revolutionslider/hint2-red.png" id="rev-hint2" alt="Image 1" />
              </div>
            </li>
            </ul>
                <div className="tp-bannertimer tp-bottom"></div>
            </div>
        </div>
      </div>


      <div className ="main">
      <div className ="container">
        
        <div className="row service-box margin-bottom-40">
          <div className="col-md-4 col-sm-4">
            <div className="service-box-heading">
              <em><i className="fa fa-location-arrow blue"></i></em>
              <span>Support</span>
            </div>
            <p>A well-designed customer service system for dealing with incoming call requests from any web page.</p>
          </div>
          <div className="col-md-4 col-sm-4">
            <div className="service-box-heading">
              <em><i className="fa fa-check red"></i></em>
              <span>Reports</span>
            </div>
            <p>View reports on performance by agents and teams, agent response time, call statistic, team traffic to get the insights.</p>
          </div>
          <div className="col-md-4 col-sm-4">
            <div className="service-box-heading">
              <em><i className="fa fa-compress green"></i></em>
              <span>Live Communication</span>
            </div>
            <p>Instant chat, make audio call, share screen to communicate the problem and solve them live.</p>
          </div>
        </div>
       


        <div className="row margin-bottom-40 front-steps-wrapper front-steps-count-3">
          <div className="col-md-4 col-sm-4 front-step-col">
            <div className="front-step front-step1">
              <h2>Put widget on your website</h2>
              <p>Customer join widget to make call request to agent</p>
            </div>
          </div>
          <div className="col-md-4 col-sm-4 front-step-col">
            <div className="front-step front-step2">
              <h2>Pick a Call</h2>
              <p>Agent picks call, jot down call summary and helps visitor</p>
            </div>
          </div>
          <div className="col-md-4 col-sm-4 front-step-col">
            <div className="front-step front-step3">
              <h2>Reports</h2>
              <p>View insights of work by agents, teams and call traffic.</p>
            </div>
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

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Intro);
