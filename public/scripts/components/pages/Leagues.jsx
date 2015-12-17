import _ from 'lodash';
import { autobind } from 'core-decorators';
import React, { Component, PropTypes } from 'react';

import scroll from '../../utils/scrollTo';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import LeagueForm from '../leagues/LeagueForm.jsx';
import LeaguesList from '../leagues/LeaguesList.jsx';

import LeaguesActions from '../../actions/LeaguesActions';

class LeaguesApp extends Component {

}

export default connect(state => state.toJS())(LeaguesApp);
