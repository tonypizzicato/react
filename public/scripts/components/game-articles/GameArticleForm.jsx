"use strict";

var React               = require('react'),
    mui                 = require('material-ui'),

    Button              = mui.RaisedButton,
    Toggle              = mui.Toggle,

    MediumEditor        = require('../MediumEditor.jsx'),
    ImageUpload         = require('../ImageUpload.jsx'),

    EventsConstants      = require('../../constants/EventsConstants'),

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
            validation: {},
            central:    this.props.article.centralGame
        }
    },

    componentDidMount: function () {
        GameArticlesStore.addChangeListener(this._onChange);
        GameArticlesStore.addValidationListener(this._onValidationError);
    },

    componentWillUnmount: function () {
        GameArticlesStore.removeChangeListener(this._onChange);
        GameArticlesStore.removeValidationListener(this._onValidationError);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!nextProps.article.hasOwnProperty('_id')) {
            this._clearForm();
        }
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
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

        if (article.centralGame) {
            article.imageHome = this.refs.imageHome.getImage();
            article.imageAway = this.refs.imageAway.getImage();
        }

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

        this._clearForm();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    _clearForm: function() {
        this.refs.body.setValue('');
        this.refs.show.setToggled(false);
        this.refs.central.setToggled(false);
        this.refs.imageHome.setImage(null);
        this.refs.imageAway.setImage(null);
    },

    _onCentral: function (e, central) {
        this.setState({central: central});
    },

    render: function () {
        var preview = false;
        if (this.props.type == 'preview') {
            preview = (
                <div>
                    <div className="s_width_half s_display_inline-block">
                        <div className="s_width_quarter">
                            <Toggle
                                name="central"
                                value="central"
                                label="Central"
                                defaultToggled={this.props.article.centralGame}
                                key={this.props.article._id + '-central'}
                                onToggle={this._onCentral}
                                ref="central" />
                        </div>
                    </div>

                    <ImageUpload
                        label="Select home team image (required if match is central)"
                        image={this.props.article.imageHome}
                        errorText={this.state.validation.imageHome ? 'Загрузите изображение для команды хозяев' : null}
                        width="360px"
                        height="300px"
                        className={this.state.central ? '' : 's_display_none'}
                        key={this.props.article._id + '-image-home-upload'}
                        ref="imageHome" />

                    <ImageUpload
                        label="Select away team image (required if match is central)"
                        image={this.props.article.imageAway}
                        errorText={this.state.validation.imageAway ? 'Загрузите изображение для команды гостей' : null}
                        width="360px"
                        height="300px"
                        className={this.state.central ? '' : 's_display_none'}
                        key={this.props.article._id + '-image-away-upload'}
                        ref="imageAway" />
                </div>
            )
        }
        return (
            <div>
                <MediumEditor
                    hintText="Введите текст"
                    placehoder="Статья"
                    defaultValue={this.props.article.body}
                    errorText={this.state.validation.preview ? 'Поле не может быть пустым' : null}
                    key={this.props.article._id}
                    ref="body" />

                <div className="s_position_relative" key="article-state-radio">
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
                    </div>

                    <div className="buttons s_float_r s_width_quarter">
                        <Button className="button_type_cancel s_mt_12" label="Cancel" secondary={true} onClick={this._onCancel} />
                        <Button className="button_type_save s_float_r s_mt_12" label="Save" primary={true} onClick={this._onSave} />
                    </div>

                    {preview}
                </div>
            </div>
        );
    }
});

module.exports = GameArticleForm;