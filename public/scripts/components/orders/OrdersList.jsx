import React, { Component, PropTypes} from 'react';

import Spacing from 'material-ui/lib/styles/spacing';

import OrderItem from '../orders/OrderItem.jsx';

class OrdersList extends Component {

    static propTypes = {
        orders: PropTypes.array.isRequired
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
                marginTop:     Spacing.desktopGutter,
                paddingTop:    0,
                paddingBottom: 0
            }
        }
    }
}

export default OrdersList;
