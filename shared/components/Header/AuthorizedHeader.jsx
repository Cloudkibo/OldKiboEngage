import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';
import auth from '../../services/auth';
import Logout from '../../container/Auth/Logout';
import moment from 'moment'
import { getnews,updatenews}  from '../../redux/actions/actions'
import { connect } from 'react-redux';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}

class AuthorizedHeader extends Component
{
 constructor(props, context) {


    super(props, context);

  }

 onClickNews(news,e){
 e.preventDefault();
 const usertoken = auth.getToken();

 this.props.updatenews(news,usertoken);
 }
  componentDidMount(){

       const usertoken = auth.getToken();
       this.props.getnews(this.props.user._id,usertoken);

  }

  render()
  {
    return (

      <div  className = "page-header navbar" >
        <div className="page-header-inner">
          <div className = "page-logo" >
              <a href = '/' >
                <h4> KiboEngage </h4>
              </a>
              	<div className="menu-toggler sidebar-toggler hide">
          </div>
          </div >
          <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
		</a>
          <div className="top-menu">
            <ul  className ="nav navbar-nav pull-right">

                    {this.props.news &&

                  <li className="dropdown dropdown-extended dropdown-notification" >
                      <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                      <i className="fa fa-bell-o"></i>
                          <span className="badge badge-default">{this.props.news.length} </span>
                      </a>
                     <ul className="dropdown-menu">
                          <li className="external">
                            <h3><span className="bold">{this.props.news.length}</span> notifications</h3>
                            <a>view all</a>
                          </li>

                          <li>
                              <ul className="dropdown-menu-list scroller" style={{height: 250+'px',overflowY: 'scroll'}} data-handle-color="#637283">
                                  {
                                    this.props.news && this.props.news.map((news, i) => (

                                  <li onClick={this.onClickNews.bind(this,news)}>
                                    <Link to='#'>
                                          <span className="time">{handleDate(news.dateCreated)}</span>
                                          <span className="details">
                                          <span className="label label-sm label-icon label-success">
                                          <i className="fa fa-bell-o"></i>
                                          </span>
                                          {news.message} </span>
                                    </Link>
                                  </li>
                                    ))

                                  }
                                </ul>
                              </li>
                     </ul>
                  </li>
            }
             <li className="dropdown dropdown-user">
                        <a  href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                          <span className ="username">
                               {this.props.name}
                          </span>
                          <i className="fa fa-angle-down"/>
                          </a>
                            <ul className="dropdown-menu">
                                <li>
                                  <Link to="/myprofile">
                                    <i className="fa fa-user"/>
                                    My Profile
                                  </Link>
                                </li>


                                <li>

                                  <Link to="/mypickedchatsessions">
                                    <i className="fa fa-phone-square"/>
                                     My Picked Sessions
                                  </Link>
                                </li>

                                <li>
                                 <Logout roomid = {this.props.roomid}/>
                                </li>


                            </ul>
              </li>

              	<li class="dropdown dropdown-quick-sidebar-toggler">
					<a href="javascript:;" class="dropdown-toggle">
					<i class="icon-logout"></i>
					</a>
				</li>


            </ul>
          </div>



    </div >
    </div>

  );
  }
}

function mapStateToProps(state) {
    return {

    team: (state.dashboard.team),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    agent :(state.dashboard.agent),
    errorMessage:(state.dashboard.errorMessage),
    channels :(state.dashboard.channels),
    userdetails:(state.dashboard.userdetails),
    news : (state.dashboard.news)
  };
}
export default connect(mapStateToProps,{ getnews,updatenews})(AuthorizedHeader);
