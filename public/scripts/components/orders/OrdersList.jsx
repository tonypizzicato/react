import React, { Component, PropTypes } from 'react';

import * as Colors from 'material-ui/styles/colors';
import OrderItem from '../orders/OrderItem.jsx';

class OrdersList extends Component {

    static propTypes = {
        orders: PropTypes.array.isRequired
    };

    render() {
        if (!this.props.orders.length) {
            return false;
        }

        const styles = this.getStyles();

        return (
            <div style={styles.root}>
                {this.props.orders.map((item, i) => {
                    return (
                        <div key={item._id}>
                            <OrderItem order={item} key={item._id}/>
                        </div>
                    )
                })}
            </div>
        );
    }

    getStyles() {
        return {
            root:    {
                paddingTop:    0,
                paddingBottom: 0,
                border:        'solid 1px ' + Colors.faintBlack,
                position:      'relative',
                overflow:      'hidden'
            },
            divider: {
                marginLeft: 0
            }
        }
    }
}

export default OrdersList;
