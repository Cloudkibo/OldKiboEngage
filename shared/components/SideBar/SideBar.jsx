import React from 'react';
import { Link } from 'react-router';

function SideBar() {
  return (
     <div className="sidebar col-md-3 col-sm-3">
        <ul className="list-group margin-bottom-25 sidebar-menu">
            <li className="list-group-item clearfix">
                <Link to='/login'>
                  <i className ="fa fa-angle-right"/>
                    Login
                </Link>
            </li>
            <li className="list-group-item clearfix">
            <Link to='/signup'>
            <i className ="fa fa-angle-right"/>
            Sign Up
            </Link>
            </li>
            <li className="list-group-item clearfix">
            <Link to='/forgotpassword'>
            <i className ="fa fa-angle-right"/>
            Reset Password
            </Link>
            </li>
            </ul>
        </div>




);
}

export default SideBar;
