"use strict";

var React      = require('react'),
    mui        = require('material-ui'),

    Paper      = mui.Paper,
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

    componentDidMount: function () {

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
                            <h5>{this.props.tournament.name}&nbsp;<span className="text_color_muted">{this.props.tournament.slug}</span>
                            </h5>

                        </div>

                        <div className="s_float_r">
                            <div className="list-item__switcher s_display_inline-block s_valign_m text_align_r">
                                {this.props.tournament.country ? this.props.tournament.country.name : ''}
                            </div>
                            <div className="list-item__switcher s_display_inline-block s_valign_m text_align_r">
                                {this.props.tournament.state}
                            </div>
                            <div className="list-item__icon s_display_inline-block s_valign_m">
                                <IconButton icon="hardware-keyboard-arrow-down" onClick={this._changeSort} data-id={this.props.tournament._id} data-sort="-1" />
                            </div>
                            <div className="list-item__icon s_display_inline-block s_valign_m">
                                <IconButton icon="hardware-keyboard-arrow-up" onClick={this._changeSort} data-id={this.props.tournament._id} data-sort="1" />
                            </div>
                            <div className="list-item__icon s_display_inline-block s_valign_m s_float_r">
                                <IconButton icon="editor-mode-edit" onClick={this.props.onEdit} data-id={this.props.tournament._id} data-sort="-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }
});

module.exports = TournamentItem;
