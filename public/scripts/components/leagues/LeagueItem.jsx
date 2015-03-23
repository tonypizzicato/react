"use strict";

var React  = require('react'),
    cx     = React.addons.classSet,
    mui    = require('material-ui'),
    Dragon = require('react-dragon'),

    Paper  = mui.Paper,
    Icon   = mui.FontIcon,
    IconButton = mui.IconButton;

var LeagueItem = React.createClass({

    propTypes: function () {
        return {
            league: React.PropTypes.shape({
                name: React.PropTypes.string,
                slug: React.PropTypes.string
            }).required,
            onEdit: React.PropTypes.func.required,
            onDrop: React.PropTypes.func.required
        };
    },

    getDefaultProps: function () {
        return {
            league: {}
        }
    },

    render: function () {
        var visibilityClass = cx({
            'list-item__visibility':  true,
            'mdfi_action_visibility': true,
            'mdfi_action_visibility_off': !this.props.league.show
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
                            <h5>{this.props.league.name}&nbsp;
                                <span className="text_color_muted">{this.props.league.slug}</span>
                            </h5>

                        </div>

                        <div className="s_float_r">
                            <div className="s_display_inline-block s_valign_m s_float_r">
                                <IconButton iconClassName="mdfi_editor_mode_edit" onClick={this.props.onEdit} data-id={this.props.league._id} />
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        );
        return (
            <Dragon key={this.props.league._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                {item}
            </Dragon>
        );
    }
});

module.exports = LeagueItem;
