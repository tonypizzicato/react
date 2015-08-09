"use strict";

var React      = require('react'),
    cx         = React.addons.classSet,
    mui        = require('material-ui'),

    Dragon     = require('../Dragon.jsx'),

    Paper      = mui.Paper,
    Icon       = mui.FontIcon,
    IconButton = mui.IconButton;

var OrderItem = React.createClass({

    propTypes: function () {
        return {
            order: React.PropTypes.object
        }
    },

    getInitialState: function () {
        return {
            active: false
        }
    },

    _changeActiveState: function () {
        this.setState({active: !this.state.active});
    },

    render: function () {
        var activeClassBody = cx({
            'list-item__body': true,
            's_display_block': this.state.active
        });

        return (
            <Paper>
                <div className="list-item panel s_pt_0 s_pb_0 s_pr_0 s_pl_0 s_mt_12">
                    <div className="list-item__header">
                        <div className="s_display_inline-block s_valign_m">
                            <IconButton iconClassName="mdfi_action_subject" onClick={this._changeActiveState} />
                        </div>

                        <div className="list-item__title list-item__title_type_orders text_overflow_ellipsis s_display_inline-block s_valign_m">
                            <span>{this.props.order.name}&nbsp;</span>
                            <span className="text_color_muted">{this.props.order.email}</span>
                        </div>
                    </div>

                    <div className={activeClassBody}>
                        <span>Имя: {this.props.order.name}</span><br />
                        <span>Email: {this.props.order.email}</span><br />
                        <span>Желаемый район: {this.props.order.region}</span><br />
                        <span>Желаемая лига: {this.props.order.league}</span><br />
                        <span>Желаемая команда: {this.props.order.team}</span><br />
                        <span>Источник: {this.props.order.source}</span><br />
                    </div>
                </div>
            </Paper>
        );
    }
});

module.exports = OrderItem;
