"use strict";

var _                   = require('underscore'),
    React               = require('react'),
    mui                 = require('material-ui'),

    Button              = mui.RaisedButton,
    Toggle              = mui.Toggle,
    TextField           = mui.TextField,

    MediumEditor        = require('../MediumEditor.jsx'),
    ImageUpload         = require('../ImageUpload.jsx'),

    EventsConstants     = require('../../constants/EventsConstants'),

    AuthStore           = require('../../stores/AuthStore'),

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
            youtube:     [this.refs.youtube1.getValue(),this.refs.youtube2.getValue()],
            vimeo:       [this.refs.vimeo1.getValue(), this.refs.vimeo2.getValue()],
            author:      AuthStore.getUser().username
        };

        if (this.props.type == 'preview') {
            article = _.extend(article, {
                centralGame: this.refs.central.isToggled()
            });
        }

        if (article.centralGame) {
            article = _.extend(article, {
                imageHome: this.refs.imageHome.getImage(),
                imageAway: this.refs.imageAway.getImage()
            });
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

    _clearForm: function () {
        this.refs.body.setValue('');
        this.refs.show.setToggled(false);
        this.refs.central.setToggled(false);
        this.refs.imageHome.setImage(null);
        this.refs.imageAway.setImage(null);
        this.refs.youtube1.setValue('');
        this.refs.vimeo1.setValue('');
        this.refs.youtube2.setValue('');
        this.refs.vimeo2.setValue('');
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
                        <div className="s_width_third">
                            <Toggle
                                name="central"
                                value="central"
                                label="Центральный"
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

                <div className="s_mb_24">
                    <div className="s_width_half s_display_inline-block s_pr_12">
                        <TextField
                            defaultValue={this.props.article.youtube && this.props.article.youtube.length ? this.props.article.youtube[0] : ''}
                            hintText="Введите ID видео на youtube"
                            floatingLabelText="Youtube"
                            ref="youtube1" />
                        <TextField
                            defaultValue={this.props.article.youtube && this.props.article.youtube.length == 2 ? this.props.article.youtube[1] : ''}
                            hintText="Введите ID видео на youtube"
                            floatingLabelText="Youtube"
                            ref="youtube2" />
                    </div>
                    <div className="s_width_half s_display_inline-block s_pl_12">
                        <TextField
                            defaultValue={this.props.article.vimeo && this.props.article.vimeo.length ? this.props.article.vimeo[0] : ''}
                            hintText="Введите ссылку на видео на vimeo"
                            floatingLabelText="Vimeo"
                            ref="vimeo1" />
                        <TextField
                            defaultValue={this.props.article.vimeo && this.props.article.vimeo.length == 2 ? this.props.article.vimeo[1] : ''}
                            hintText="Введите ссылку на видео на vimeo"
                            floatingLabelText="Vimeo"
                            ref="vimeo2" />
                    </div>
                </div>

                <div className="s_position_relative" key="article-state-radio">

                    <div className="s_float_l s_width_half s_mt_12">
                        <div className="s_width_third s_display_inline-block">
                            <Toggle
                                name="show"
                                value="show"
                                label="Показывать"
                                defaultToggled={this.props.article.show}
                                key={this.props.article._id + '-show'}
                                ref="show" />
                        </div>
                    </div>

                    <div className="buttons s_float_r s_width_quarter">
                        <Button className="button_type_cancel s_mt_12" label="Отменить" secondary={true} onClick={this._onCancel} />
                        <Button className="button_type_save s_float_r s_mt_12" label="Сохранить" primary={true} onClick={this._onSave} />
                    </div>

                    {preview}
                </div>
            </div>
        );
    }
});

module.exports = GameArticleForm;
