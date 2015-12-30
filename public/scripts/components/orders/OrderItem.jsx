import React, { Component, PropTypes} from 'react';

import Spacing from 'material-ui/lib/styles/spacing';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Avatar from 'material-ui/lib/avatar';

class OrderItem extends Component {

    static propTypes = {
        order: PropTypes.object.isRequired
    };

    render() {
        return (
            <Card style={this.getStyles().root}>
                <CardHeader
                    title={this.props.order.name}
                    subtitle={this.props.order.email ? this.props.order.email : this.props.order.phone}
                    avatar={<Avatar>{this.props.order.name[0]}</Avatar>}
                    showExpandableButton={true}>
                </CardHeader>
                <CardText expandable={true} initiallyExpanded={false} key={this.props.order._id}>
                    <span>Дата добавления: {this.props.order.dc}</span><br />
                    <span>Имя: {this.props.order.name}</span><br />
                    <span>Email: {this.props.order.email}</span><br />
                    <span>Телефон: {this.props.order.phone}</span><br />
                    <span>Желаемый район: {this.props.order.region}</span><br />
                    <span>Желаемая лига: {this.props.order.league}</span><br />
                    <span>Желаемая команда: {this.props.order.team}</span><br />
                    <span>Источник: {this.props.order.source}</span><br />
                    <span>Комментарий: {this.props.order.message}</span><br />
                </CardText>
            </Card>
        );
    }

    getStyles() {
        return {
            root: {
                boxSizing:    'border-box',
                margin:       Spacing.desktopGutter + ' 0',
                userSelect:   'none',
                height:       '100%',
                border:       'none',
                boxShadow:    'none',
                borderRadius: 0
            }
        }
    }
}

export default OrderItem;
