import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function Header(props, context) {
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="site-title"> Kibo Engage
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </h1>
    </div>
    </div>
  );
}

Header.contextTypes = {
  router: React.PropTypes.object,
};

/*
Header.propTypes = {
  onClick: PropTypes.func.isRequired,
  handleLogoClick: PropTypes.func,
};
*/

export default Header;
