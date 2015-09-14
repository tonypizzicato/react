const React       = require('react'),
      mui         = require('material-ui'),

      Spacing     = mui.Styles.Spacing,

      Colors      = mui.Styles.Colors,
      List        = mui.List,
      ListDivider = mui.ListDivider,

      OrderItem   = require('../orders/OrderItem.jsx');

class OrdersList extends React.Component {

    static propTypes = {
        orders: React.PropTypes.array
    }

    render() {
        if (!this.props.orders.length) {
            return false;
        }

        const items = this.props.orders.map(item => {
            return <OrderItem order={item} key={item._id}/>;
        });

        return (
            <div style={this.getStyles().root}>
                {items}
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
