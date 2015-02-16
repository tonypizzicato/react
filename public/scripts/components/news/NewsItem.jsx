"use strict";

var React       = require('react'),
    mui         = require('material-ui'),
    moment      = require('moment'),
    date        = require('../../utils/date'),

    Paper       = mui.Paper,
    IconButton  = mui.IconButton,
    Toggle      = mui.Toggle,

    NewsActions = require('../../actions/NewsActions');


var NewsItem = React.createClass({

    getInitialState: function () {
        return {
            active: false
        }
    },


    propTypes: function () {
        return {
            article:  React.PropTypes.object.isRequired,
            onDelete: React.PropTypes.func.isRequired
        }
    },

    _changeActiveState: function () {
        this.setState({active: !this.state.active});
    },

    _changeSort: function (e) {
        NewsActions.sort(parseInt(e.currentTarget.dataset.id), parseInt(e.currentTarget.dataset.sort));
    },

    render: function () {
        var activeClassBody = 'list-item__body' + (this.state.active ? ' s_display_block' : '');
        var activeClassInfo = 'list-item__info' + (this.state.active ? ' s_display_block' : '');
        return (
            <Paper className="list-item">
                <div className="panel">
                    <div className="list-item__header">
                        <div className="list-item__icon s_display_inline-block s_valign_m">
                            <IconButton icon="action-subject" onClick={this._changeActiveState} />
                        </div>

                        <span className="mui-toolbar-separator">&nbsp;</span>

                        <div className="list-item__title s_display_inline-block s_valign_m">
                            <h5>{this.props.article.title}</h5>
                        </div>

                        <div className="list-item__icon s_display_inline-block s_valign_m">
                            <IconButton icon="hardware-keyboard-arrow-down" onClick={this._changeSort} data-id={this.props.article._id} data-sort="-1" />
                        </div>
                        <div className="list-item__icon s_display_inline-block s_valign_m">
                            <IconButton icon="hardware-keyboard-arrow-up" onClick={this._changeSort} data-id={this.props.article._id} data-sort="1" />
                        </div>

                        <div className="list-item__switcher s_display_inline-block s_valign_m">
                            <Toggle name="show" value="show" defaultToggled={this.props.article.show} label="Show" />
                        </div>
                        <div className="list-item__icon s_display_inline-block s_valign_m">
                            <IconButton icon="action-highlight-remove" onClick={this.props.onDelete} data-id={this.props.article._id} data-sort="-1" />
                        </div>

                    </div>
                    <div className={activeClassInfo}>
                        <span className="mui-font-style-caption s_mr_12">{date.format(this.props.article.dc)}</span>
                        <span className="mui-font-style-caption">{this.props.article.author}</span>
                    </div>
                    <div className={activeClassBody} dangerouslySetInnerHTML={{__html: this.props.article.body}} />
                </div>
            </Paper>
        )
    }
});

module.exports = NewsItem;
