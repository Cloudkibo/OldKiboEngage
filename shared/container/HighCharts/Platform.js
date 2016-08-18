import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
var ReactDOM = require('react-dom');
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
var Highcharts = require('highcharts')



class Platform extends React.Component {
  constructor(props) {
      super(props);
        this.chart = undefined;
    }
  
  componentDidMount() {
  this.chart = $(ReactDOM.findDOMNode(this.refs.chartPlatform)).highcharts({
        chart: {
                type: 'areaspline'
            },
        plotOptions: {
          series: {
            stacking: ''
          }
       },
      series: this.props.series,
      title: {
        text: this.props.title
      },
      credits: {
        enabled: true
      },
      loading: false,
      xAxis: {
        categories: this.props.categories
      },
      size: {
        width: '900'
      }
        
        });
  }
  
  componentWillReceiveProps(props) {
    //alert('i am called');
    this.chart.highcharts().series[0].setData(props.series[0].data);
  }
  
  render() {
      return (
        <div ref='chartPlatform'>
        </div>
      )
  }
}

export default Platform;

