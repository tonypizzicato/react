"use strict";

var React      = require('react'),
    mui        = require('material-ui'),

    Paper      = mui.Paper,
    IconButton = mui.IconButton;

var CountriesItem = React.createClass({

    propTypes: function () {
        return {
            country:  React.PropTypes.object,
            onDelete: React.PropTypes.func,
            onEdit:   React.PropTypes.func
        }
    },

    _changeSort: function () {
        console.log('sort');
    },

    render: function () {
        return (
            <Paper>
                <div className="panel s_pt_0 s_pb_0 s_pr_0 s_pl_0 s_mt_12">
                    <div className="list-item__header">
                        <div className="list-item__icon s_display_inline-block s_valign_m">
                            <IconButton icon="mui-icon-sort" />
                        </div>

                        <div className="list-item__title s_display_inline-block s_valign_m">
                            <h5>{this.props.country.name}&nbsp;<span className="text_color_muted">{this.props.country.slug}</span>
                            </h5>

                        </div>

                        <div className="s_float_r">

                            <div className="list-item__switcher s_display_inline-block s_valign_m text_align_r">
                            {this.props.country.state}
                            </div>

                            <div className="list-item__icon s_display_inline-block s_valign_m">
                                <IconButton iconClassName="mdfi_hardware_keyboard_arrow_down" onClick={this._changeSort} data-id={this.props.country._id} data-sort="-1" />
                            </div>
                            <div className="list-item__icon s_display_inline-block s_valign_m">
                                <IconButton iconClassName="mdfi_hardware_keyboard_arrow_up" onClick={this._changeSort} data-id={this.props.country._id} data-sort="1" />
                            </div>
                            <div className="list-item__icon s_display_inline-block s_valign_m">
                                <IconButton iconClassName="mdfi_editor_mode_edit" onClick={this.props.onEdit} data-id={this.props.country._id} data-sort="-1" />
                            </div>
                            <div className="list-item__icon s_display_inline-block s_valign_m s_float_r">
                                <IconButton iconClassName="mdfi_action_highlight_remove" onClick={this.props.onDelete} data-id={this.props.country._id} data-sort="-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }
});

module.exports = CountriesItem;
