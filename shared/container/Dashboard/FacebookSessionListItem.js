/**
 * Created by sojharo on 09/06/2017.
 */

/**
 * Created by sojharo on 09/06/2017.
 */

import React, {PropTypes} from 'react';

function FacebookSessionListItem(props) {

  var hleft = {
    float:'center',
    display:'inline',

  };

  return (

    <div className="portlet light">
      <div className="portlet-title">
        <div className="caption">
          <i className="icon-bubbles font-dark hide"></i>
          <span className="caption-subject font-dark bold uppercase">{props.title}</span>
        </div>
      </div>
      <div className="portlet-body">
        <div className="mt-comments">
          <div className="mt-comment">
            <table id="sample_3" className="table table-striped table-bordered table-hover dataTable">
              <thead>
              <tr>
                <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Photo</th>
                <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Name</th>
                <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Page</th>
              </tr>
              </thead>
              <tbody>
              {
                props.sessions && props.sessions.length > 0 &&
                props.sessions.slice(0).reverse().map((response, i) => (
                  i < 6 &&
                  <tr key={i}>
                    <td>
                      <img src={response.user_id.profile_pic} width="36" height="36" className="user-avatar" style={hleft}/>
                    </td>
                    <td>
                      {response.user_id.first_name} {response.user_id.last_name}
                    </td>
                    <td>
                      {response.pageid.pageTitle}
                    </td>
                  </tr>
                ))
              }
              {
                !props.sessions &&
                <tr>
                  <td colSpan={3}>
                    No data to display here.
                  </td>
                </tr>
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
}

FacebookSessionListItem.propTypes = {
};

export default FacebookSessionListItem;
