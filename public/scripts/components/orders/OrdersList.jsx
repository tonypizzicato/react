const React     = require('react'),
      mui       = require('material-ui'),

      Spacing   = mui.Styles.Spacing,

      OrderItem = require('../orders/OrderItem.jsx');

class OrdersList extends React.Component {

    static propTypes = {
        orders: React.PropTypes.array
    };

    render() {
        if (!this.props.orders.length) {
            return false;
        }

        return (
            <div style={this.getStyles().root}>
                {this.props.orders.map(item => {
                    return <OrderItem order={item} key={item._id}/>;
                })}
            </div>
        );
    }

    getStyles() {
        return {
            root: {
                paddingTop: Spacing.desktopGutterLess
            }
        }
    }
}

module.exports = OrdersList;
