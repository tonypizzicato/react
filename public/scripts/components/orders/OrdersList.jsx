import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';

import Divider from 'material-ui/lib/divider';

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
                    const divider = i != this.props.orders.length - 1 ? <Divider inset={true} style={styles.divider}/> : undefined;

                    return (
                        <div key={item._id}>
                            <OrderItem order={item} key={item._id}/>
                            {divider}
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
