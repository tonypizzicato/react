"use strict";

var React               = require('react'),
    mui                 = require('material-ui'),

    Button              = mui.RaisedButton,

    MediumEditor        = require('../MediumEditor.jsx'),

    GameArticlesStore   = require('../../stores/GameArticlesStore'),
    GameArticlesActions = require('../../actions/GameArticlesActions');

var GameArticleForm = React.createClass({

    propTypes: function () {
        return {
            article: React.PropTypes.object,
            gameId:  React.PropTypes.string.required,
            type:    React.PropTypes.string.required
        }
    },

    getDefaultProps: function () {
        return {
            article: {
                body: ''
            }
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
        var article = GameArticlesStore.get(this.props.gameId, this.props.type);
        if (!article) {
            article = this.getInitialState().article;
        }

        this.setState({article: article});
    },

    _onSave: function () {
        var article = {
            body: this.refs.body.getValue(),
            type: this.props.type
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

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    render: function () {
        return (
            <div>
                <MediumEditor
                    hintText="Введите текст"
                    placehoder="Статья"
                    defaultValue={this.props.article.body}
                    errorText={this.state.validation.preview ? 'Поле не может быть пустым' : null}
                    ref="body" />

                <div className="buttons s_float_r s_width_quarter">
                    <Button className="button_type_cancel s_mt_36" label="Cancel" secondary={true} onClick={this._onCancel} />
                    <Button className="button_type_save s_float_r s_mt_36" label="Save" primary={true} onClick={this._onSave} />
                </div>
            </div>
        );
    }
});

module.exports = GameArticleForm;