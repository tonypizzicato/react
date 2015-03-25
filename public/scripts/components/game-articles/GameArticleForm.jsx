"use strict";

var React               = require('react'),
    mui                 = require('material-ui'),

    Button              = mui.RaisedButton,
    Toggle              = mui.Toggle,

    MediumEditor        = require('../MediumEditor.jsx'),

    GameArticlesStore   = require('../../stores/GameArticlesStore'),
    GameArticlesActions = require('../../actions/GameArticlesActions');

var GameArticleForm = React.createClass({

    propTypes: function () {
        return {
            article: React.PropTypes.object,
            game:    React.PropTypes.object,
            type:    React.PropTypes.string.required
        }
    },

    getDefaultProps: function () {
        return {
            article: {
                body: ''
            },
            game:    {}
        }
    },

    getInitialState: function () {
        return {
            article:    {},
            validation: {}
        }
    },

    componentDidMount: function () {
        GameArticlesStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        GameArticlesStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!nextProps.article.hasOwnProperty('_id')) {
            this.refs.body.setValue('');
        }
    },

    _onChange: function () {
        var article = GameArticlesStore.get(this.props.game._id, this.props.type);
        if (!article) {
            article = this.getInitialState().article;
        }

        this.setState({article: article});
    },

    _onSave: function () {
        var article = {
            body:        this.refs.body.getValue(),
            show:        this.refs.show.isToggled(),
            type:        this.props.type,
            tournament:  this.props.game.tournamentId,
            gameId:      this.props.game._id,
            centralGame: this.refs.central.isToggled()
        };

        this.setState({validation: this.getInitialState().validation});

        if (this.props.article._id) {
            article._id = this.props.article._id;
            GameArticlesActions.save(article);
        } else {
            GameArticlesActions.add(article);
        }
    },

    _onCancel: function () {
        this.setState({validation: this.getInitialState().validation});

        this.refs.body.setValue('');
        this.refs.show.setToggled(false);
        this.refs.central.setToggled(false);

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    render: function () {
        var centralToggle = this.props.type == 'preview' ? (
            <div className="s_width_quarter s_display_inline-block">
                <Toggle
                    name="central"
                    value="central"
                    label="Central"
                    defaultToggled={this.props.article.centralGame}
                    key={this.props.article._id + '-central'}
                    ref="central" />
            </div>) : false;
        return (
            <div>
                <MediumEditor
                    hintText="Введите текст"
                    placehoder="Статья"
                    defaultValue={this.props.article.body}
                    errorText={this.state.validation.preview ? 'Поле не может быть пустым' : null}
                    key={this.props.article._id}
                    ref="body" />

                <div className="s_position_relative s_overflow_hidden" key="article-state-radio">
                    <div className="s_float_l s_width_half s_mt_12">
                        <div className="s_width_quarter s_display_inline-block">
                            <Toggle
                                name="show"
                                value="show"
                                label="Show"
                                defaultToggled={this.props.article.show}
                                key={this.props.article._id + '-show'}
                                ref="show" />
                        </div>
                    {centralToggle}
                    </div>

                    <div className="buttons s_float_r s_width_quarter">
                        <Button className="button_type_cancel s_mt_12" label="Cancel" secondary={true} onClick={this._onCancel} />
                        <Button className="button_type_save s_float_r s_mt_12" label="Save" primary={true} onClick={this._onSave} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GameArticleForm;