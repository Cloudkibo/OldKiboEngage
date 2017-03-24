import React, { Component,PropTypes } from 'react';

import { Link } from 'react-router';

export default class ProfileSideBar extends Component
{
 render()
  {
  return (
  <div className="col-md-3">
        <ul className="ver-inline-menu tabbable margin-bottom-10">
        {this.props.iscurrent && this.props.iscurrent == "myprofile"?
            <li className="active">
                <Link to='/myprofile'>
                  <i className ="fa fa-cog"/>
                    Personal info
                </Link>
            </li>:
             <li>
                <Link to='/myprofile'>
                  <i className ="fa fa-cog"/>
                    Personal info
                </Link>
            </li>
        }


        {this.props.iscurrent && this.props.iscurrent == "changeavatar"?
            <li  className="active">
                <Link to='/changeavatar'>
                  <i className ="fa fa-picture-o"/>
                    Change Avatar
                </Link>
            </li>:
            <li>
                <Link to='/changeavatar'>
                  <i className ="fa fa-picture-o"/>
                    Change Avatar
                </Link>
            </li>
        }

        {this.props.iscurrent && this.props.iscurrent == "changepassword"?
             <li className="active">
                <Link to='/changepassword'>
                  <i className ="fa fa-lock"/>
                    Change Password
                </Link>
            </li>:
             <li>
                <Link to='/changepassword'>
                  <i className ="fa fa-lock"/>
                    Change Password
                </Link>
            </li>
        }
         {this.props.iscurrent && this.props.iscurrent == "mygroups"?
             <li className="active">
                <Link to='/mygroups'>
                  <i className ="fa fa-eye"/>
                   My Groups
                </Link>
            </li>:
             <li>
                <Link to='/mygroups'>
                  <i className ="fa fa-eye"/>
                   My Groups
                </Link>
            </li>
          }  
            
            </ul>
        </div>




);
}
}


