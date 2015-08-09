"use strict";

var React      = require('react'),
    mui        = require('material-ui'),

    Dragon     = require('../Dragon.jsx'),

    Paper      = mui.Paper,
    Icon       = mui.FontIcon,
    IconButton = mui.IconButton;

var CategoryItem = React.createClass({

    propTypes: function () {
        return {
            category: React.PropTypes.object,
            onDelete: React.PropTypes.func,
            onEdit:   React.PropTypes.func
        }
    },

    render: function () {
        var item = (
            <Paper>
                <div className="list-item panel s_pt_0 s_pb_0 s_pr_0 s_pl_0 s_mt_12">
                    <div className="list-item__header">
                        <div className="list-item__icon s_display_inline-block s_valign_m">
                            <Icon className="list-item__sort mdfi_action_swap_vert"/>
                        </div>
                        <div className="list-item__title list-item__title_type_categorys text_overflow_ellipsis s_display_inline-block s_valign_m">
                            <span>{this.props.category.name}&nbsp;</span>
                            <span className="text_color_muted">{this.props.category.title}</span>
                        </div>

                        <div className="s_float_r">
                            <div className="s_display_inline-block s_valign_m">
                                <IconButton iconClassName="mdfi_editor_mode_edit" onClick={this.props.onEdit} data-id={this.props.category._id} data-sort="-1"/>
                            </div>
                            <div className="s_display_inline-block s_valign_m s_float_r">
                                <IconButton iconClassName="mdfi_action_highlight_remove" onClick={this.props.onDelete} data-id={this.props.category._id}
                                            data-sort="-1"/>
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        );

        return (
            <Dragon key={this.props.category._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                {item}
            </Dragon>
        );
    }
});

module.exports = CategoryItem;
