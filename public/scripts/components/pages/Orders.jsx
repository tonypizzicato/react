import _ from 'lodash';
import scrollTop from '../../utils/scrollTop';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import OrdersList from '../orders/OrdersList.jsx';

import OrdersActions from '../../actions/OrdersActions';

class OrdersApp extends Component {

    static propTypes = {
        leagues: PropTypes.object.isRequired,
        orders:  PropTypes.object.isRequired
    };

    static defaultProps = {
        leagues: []
    };

    state = {
        activeTab:       0,
        selectedContact: {}
    };

    constructor(props) {
        super(props);

        this._onTabChange = this._onTabChange.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(OrdersActions.fetch());
    }

    _onTabChange(tab) {
        this.setState({
            activeTab: tab.props.tabIndex
        });
    }

    render() {
        return (
            <Tabs>
                {this.props.leagues.items.map((league, index) => {
                    const ordersItems = this.props.orders.items.filter(item => item.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <OrdersList orders={ordersItems}/>
                        )
                    }

                    return (
                        <Tab label={league.name} onActive={this._onTabChange} key={league._id}>
                            {tabContent}
                        </Tab>
                    );
                })}
            </Tabs>
        );
    }
}

function mapState(state) {
    return {
        leagues: state.get('leagues').toJS(),
        orders:  state.get('orders').toJS()
    }
};

export default connect(mapState)(OrdersApp);
