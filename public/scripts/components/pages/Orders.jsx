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
    }

    constructor(props) {
        super(props);

        this.state = {
            orders:          [],
            selectedContact: {}
        }

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        OrdersStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        OrdersStore.removeChangeListener(this._onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.leagues.length) {
            OrdersActions.load();
        }
    }

    _onChange() {
        this.setState({
            order: OrdersStore.getAll()
        });
    }

    render() {
        const tabItems = this.props.leagues.map(league => {
            const ordersItems = OrdersStore.getByLeague(league._id).filter(item => item.leagueId == league._id);

            return (
                <Tab label={league.name} key={league._id}>
                    <OrdersList orders={ordersItems}/>
                </Tab>
            );
        });

        return (
            <Tabs>{tabItems}</Tabs>
        );
    }
}

module.exports = OrdersApp;
