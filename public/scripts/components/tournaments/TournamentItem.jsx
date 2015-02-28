"use strict";

var React      = require('react'),
    cx         = React.addons.classSet,
    mui        = require('material-ui'),
    Dragon     = require('react-dragon'),

    Paper      = mui.Paper,
    Icon       = mui.FontIcon,
    IconButton = mui.IconButton;

var TournamentItem = React.createClass({

    propTypes: function () {
        return {
            tournament: React.PropTypes.shape({
                name:    React.PropTypes.string,
                slug:    React.PropTypes.string,
                country: React.PropTypes.object,
                state:   React.PropTypes.string
            }),
            onEdit:     React.PropTypes.func
        };
    },

    getDefaultProps: function () {
        return {
            tournament: {}
        }
    },

    render: function () {
        var visibilityClass = cx({
            'list-item__visibility':         true,
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.tournament.show
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
                            <h5>{this.props.tournament.name}&nbsp;
                                <span className="text_color_muted">{this.props.tournament.slug}</span>
                            </h5>

                        </div>

                        <div className="s_float_r">
                            <div className="mui-label s_display_inline-block s_valign_m text_align_r s_mr_12">
                                {this.props.tournament.country ? this.props.tournament.country.name : ''}
                            </div>
                            <div className="mui-label s_display_inline-block s_valign_m text_align_r s_mr_12">
                                {this.props.tournament.state}
                            </div>
                            <div className="s_display_inline-block s_valign_m s_float_r">
                                <IconButton iconClassName="mdfi_editor_mode_edit" onClick={this.props.onEdit} data-id={this.props.tournament._id} data-sort="-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        );
        return (
            <Dragon key={this.props.tournament._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                {item}
            </Dragon>
        );
    }
});

module.exports = TournamentItem;
