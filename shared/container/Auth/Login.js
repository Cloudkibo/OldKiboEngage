/**
 * Created by Zarmeen on 2016-04-25.
 */
import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {loginuser} from '../../redux/actions/actions'
class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.submitlogin = this.submitlogin.bind(this);
    }
    submitlogin()
    {
        console.log('submitting login');
        this.props.loginuser();
    }
    render() {
        return (
            <div className="login">
        <h1>This is a login page</h1>
        <a className="post-submit-button align-right" href="#" onClick={this.submitlogin}>Submit</a>
        </div>
    );
    }
}

Login.propTypes = {
    submitlogin: PropTypes.func,

};

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps, { loginuser })(Login);



