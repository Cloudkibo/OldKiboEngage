import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function PostListItem(props) {
  return (
    <div className="single-post">
      <h3 className="post-title ">
       {props.post.deptCapital}
      </h3>
      <p className="author-name">By {props.post.deptname}</p>
   
      <hr className="divider"/>
    </div>
  );
}

PostListItem.propTypes = {
  post: PropTypes.shape({
     deptCapital: PropTypes.string.isRequired,
    deptdescription: PropTypes.string.isRequired,
    deptname: PropTypes.string.isRequired
  }).isRequired
};

export default PostListItem;