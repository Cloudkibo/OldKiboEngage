import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';

export default class AuthorizedHeader extends Component
{

  render()
  {
    return (
      < div  className = "page-header-inner" >
    < div    className = "page-logo" >
        < a  href = '/' >
        < h4 > Kibo
        Support
        System < / h4 >
        < / a >
        < / div >
   {
      this.props.loggedin === "true" &&
    {

    }
}

</div >

)
;
}
}
AuthorizedHeader.propTypes = {
  loggedin:PropTypes.string
}



export default AuthorizedHeader;
