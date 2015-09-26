"use strict";

var React           = require('react'),
    Router          = require('react-router'),
    mui             = require('material-ui'),

    Tabs            = mui.Tabs,
    Tab             = mui.Tab,

    EventsConstants = require('../../constants/EventsConstants'),

    OrdersActions   = require('../../actions/OrdersActions'),
    OrdersStore     = require('../../stores/OrdersStore'),

    OrdersList      = require('../orders/OrdersList.jsx');

class OrdersApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.required
    };

    static defaultProps = {
        leagues: []
    };

    state = {
        activeTab:       0,
        orders:          [],
        selectedContact: {}
    };

    constructor(props) {
        super(props);

        this._onChange    = this._onChange.bind(this);
        this._onTabChange = this._onTabChange.bind(this);
    }

    componentDidMount() {
        OrdersStore.addChangeListener(this._onChange);

        if (this.props.leagues.length > 0) {
            OrdersActions.load();
        }
    }

    componentWillUnmount() {
        OrdersStore.removeChangeListener(this._onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.leagues.length != nextProps.leagues.length) {
            OrdersActions.load();
        }
    }

    _onTabChange(tab) {
        this.setState({
            activeTab: tab.props.tabIndex
        });
    }

    _onChange() {
        this.setState({
            order: OrdersStore.getAll()
        });
    }

    shouldComponentUpdate() {
        return this.props.leagues.length > 0;
    }

    render() {
        return (
            <Tabs>
                {this.props.leagues.map((league, index) => {
                    const ordersItems = OrdersStore.getByLeague(league._id).filter(item => item.leagueId == league._id);

                    let tabContent;
                    if (this.state.activeTab == index) {
                        tabContent = (
                            <OrdersList orders={ordersItems}/>
                        )
                    }

                    return (
                        <Tab onActive={this._onTabChange} label={league.name} key={league._id}>
                            {tabContent}
                        </Tab>
                    );
                })}
            </Tabs>
        );
    }
}

module.exports = OrdersApp;
