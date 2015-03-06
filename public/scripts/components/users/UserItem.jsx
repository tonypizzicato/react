"use strict";

var React      = require('react'),
    mui        = require('material-ui'),

    Paper      = mui.Paper,
    Icon       = mui.FontIcon,
    IconButton = mui.IconButton;

var UserItem = React.createClass({

    propTypes: function () {
        return {
            user: React.PropTypes.object
        };
    },

    getDefaultProps: function () {
        return {
            user: {}
        }
    },

    render: function () {
        return (
            <Paper>
                <div className="list-item panel s_pt_0 s_pb_0 s_pr_0 s_pl_0 s_mt_12">
                    <div className="list-item__icon s_display_inline-block s_valign_m">
                        <Icon className="mdfi_action_account_circle" />
                    </div>
                    <span className="s_valign_m text_font-size_16 s_mr_24">{this.props.user.username}</span>

                    <div className="list-item__icon s_display_inline-block s_valign_m">
                        <Icon className="mdfi_content_mail text_font-size_18" />
                    </div>
                    <span className="s_valign_m text_font-size_14">{this.props.user.email}</span>

                    <IconButton
                        href={this.props.user.vk}
                        target="_blank"
                        className="s_float_r"
                        iconClassName="mdfi_social_people"
                        tooltip="Vk"
                        linkButton={true} />

                </div>
            </Paper>
        );
    }
});

module.exports = UserItem;
