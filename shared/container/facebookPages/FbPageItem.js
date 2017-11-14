import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class FbPageItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      role: '',
      isChecked: this.props.isChecked,
      useringroup: false,
    }
  }

  render() {
  return (
    <tr className = "odd">
      <td>
      <center>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={() => {
            this.setState({ isChecked: !this.state.isChecked });
            this.props.selectCheckedItem(this.props.page.pageid);
          }}
        />
      </center>
      </td>
      <td>{this.props.page.pageTitle} </td>
      <td>{this.props.page.pageDescription}</td>
      { this.props.userdetails.isAgent == "Yes"?
                    <br/> :
                    <td>
                      <Link to={`/editfbpage/${this.props.page.pageid}`} className="btn blue-madison" >
                      Edit
                      </Link>
                      <button className="btn blue-madison" onClick={this.props.onDelete}> Delete </button>

                    </td>




                 }

    </tr>

  );
}
}

FbPageItem.propTypes = {
  onDelete: PropTypes.func.isRequired,

};

export default FbPageItem;
