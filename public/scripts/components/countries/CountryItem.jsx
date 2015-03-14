"use strict";

var React      = require('react'),
    cx         = React.addons.classSet,
    mui        = require('material-ui'),
    Dragon     = require('react-dragon'),

    Paper      = mui.Paper,
    Icon       = mui.FontIcon,
    IconButton = mui.IconButton;

var CountryItem = React.createClass({

    propTypes: function () {
        return {
            country:  React.PropTypes.object,
            onDelete: React.PropTypes.func,
            onEdit:   React.PropTypes.func
        }
    },

    render: function () {
        var visibilityClass = cx({
            'list-item__visibility':      true,
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.country.show
        });
        var item = (
            <Paper>
                <div className="list-item panel s_pt_0 s_pb_0 s_pr_0 s_pl_0 s_mt_12">
                    <div className="list-item__header">
                        <div className="list-item__icon s_display_inline-block s_valign_m">
                            <Icon className="list-item__sort mdfi_action_swap_vert" />
                            <Icon className={visibilityClass} />
                        </div>

                        <div className="list-item__title s_display_inline-block s_valign_m">
                            <h5>{this.props.country.name}&nbsp;
                                <span className="text_color_muted">{this.props.country.slug}</span>
                            </h5>

                        </div>

                        <div className="s_float_r">
                            <div className="s_display_inline-block s_valign_m text_align_r">
                            {this.props.country.state}
                            </div>

                            <div className="s_display_inline-block s_valign_m">
                                <IconButton iconClassName="mdfi_editor_mode_edit" onClick={this.props.onEdit} data-id={this.props.country._id} data-sort="-1" />
                            </div>
                            <div className="s_display_inline-block s_valign_m s_float_r">
                                <IconButton iconClassName="mdfi_action_highlight_remove" onClick={this.props.onDelete} data-id={this.props.country._id} data-sort="-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        );

        return (
            <Dragon key={this.props.country._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                {item}
            </Dragon>
        );
    }
});

module.exports = CountryItem;
