"use strict";

var React      = require('react'),
    cx         = React.addons.classSet,
    mui        = require('material-ui'),
    date       = require('../../utils/date'),

    Dragon     = require('../Dragon.jsx'),

    Paper      = mui.Paper,
    Icon       = mui.FontIcon,
    IconButton = mui.IconButton;


var NewsItem = React.createClass({

    getInitialState: function () {
        return {
            active: false
        }
    },

    getDefaultProps: function () {
        return {
            article: {}
        }
    },

    propTypes: function () {
        return {
            index:    React.PropTypes.number.isRequired,
            article:  React.PropTypes.object.isRequired,
            onDelete: React.PropTypes.func.isRequired,
            onEdit:   React.PropTypes.func.isRequired,
            onDrop:   React.PropTypes.func.isRequired
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
        var activeClassInfo = cx({
            'list-item__info': true,
            's_display_block': this.state.active
        });
        var visibilityClass = cx({
            'list-item__visibility':      true,
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.article.show
        });

        var item = (
            <Paper className="list-item list-item_type_news">
                <div className="list-item panel s_pt_0 s_pb_0 s_pr_0 s_pl_0 s_mt_12">
                    <div className="list-item__header">
                        <div className="s_display_inline-block s_valign_m">
                            <IconButton iconClassName="mdfi_action_subject" onClick={this._changeActiveState} />
                        </div>
                        <div className="list-item__icon s_display_inline-block s_valign_m">
                            <Icon className="list-item__sort mdfi_action_swap_vert s_pl_0" />
                            <Icon className={visibilityClass} />
                        </div>

                        <div className="list-item__title s_display_inline-block s_valign_m">
                            <h5>{this.props.article.title}</h5>
                        </div>

                        <div className="s_float_r">
                            <div className="s_display_inline-block s_valign_m text_align_r">
                            {this.props.article.state}
                            </div>

                            <div className="s_display_inline-block s_valign_m">
                                <IconButton iconClassName="mdfi_editor_mode_edit" onClick={this.props.onEdit} data-id={this.props.article._id} data-sort="-1" />
                            </div>
                            <div className="s_display_inline-block s_valign_m s_float_r">
                                <IconButton iconClassName="mdfi_action_highlight_remove" onClick={this.props.onDelete} data-id={this.props.article._id} data-sort="-1" />
                            </div>
                        </div>

                    </div>
                    <div className={activeClassInfo}>
                        <span className="mui-font-style-caption s_mr_12">{date.format(this.props.article.dc)}</span>
                        <span className="mui-font-style-caption">{this.props.article.author}</span>
                    </div>
                    <div className={activeClassBody} dangerouslySetInnerHTML={{__html: this.props.article.body}} />
                </div>
            </Paper>
        );

        return (
            <Dragon key={this.props.article._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                {item}
            </Dragon>
        );
    }
});

module.exports = NewsItem;
