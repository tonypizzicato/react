"use strict";

var _                   = require('lodash'),
    React               = require('react'),
    mui                 = require('material-ui'),

    Button              = mui.RaisedButton,
    Toggle              = mui.Toggle,
    TextField           = mui.TextField,
    IconButton          = mui.IconButton,

    MediumEditor        = require('../MediumEditor.jsx'),
    ImageUpload         = require('../ImageUpload.jsx'),
    VideoUpload         = require('../VideoUpload.jsx'),

    EventsConstants     = require('../../constants/EventsConstants'),

    AuthStore           = require('../../stores/AuthStore'),

    GameArticlesStore   = require('../../stores/GameArticlesStore'),
    GameArticlesActions = require('../../actions/GameArticlesActions');

var GameArticleForm = React.createClass({

    propTypes: function () {
        return {
            leagueId: React.PropTypes.string.required,
            type:     React.PropTypes.string.required,
            article:  React.PropTypes.object,
            game:     React.PropTypes.object
        }
    },

    getDefaultProps: function () {
        return {
            article: {},
            game:    {}
        }
    },

    getInitialState: function () {
        return {
            saving:      false,
            article:     this.props.article,
            validation:  {},
            central:     this.props.article.centralGame,
            videosCount: this.props.article.video ? (this.props.article.video.length ? this.props.article.video.length : 1) : 1
        }
    },

    componentDidMount: function () {
        GameArticlesStore.addValidationListener(this._onValidationError);
    },

    componentWillUnmount: function () {
        GameArticlesStore.removeValidationListener(this._onValidationError);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!nextProps.article.hasOwnProperty('_id')) {
            this._clearForm();
        }
        this.setState({saving: false});
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    _onSave: function () {
        var article = {
            body:       this.refs.body.getValue(),
            show:       this.refs.show.isToggled(),
            type:       this.props.type,
            leagueId:   this.props.leagueId,
            tournament: this.props.game.tournamentId,
            gameId:     this.props.game._id
        };

        var videos = [],
            video;
        for (var i = 0; i < this.state.videosCount; i++) {
            video = this.refs['video-' + i].getValue();
            if (video.type && video.url.length) {
                videos.push(video);
            }
        }

        article.video = videos;

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

        this.setState({
            validation: this.getInitialState().validation,
            saving:     true
        });

        if (this.props.article._id) {
            article.editor = AuthStore.getUser().username;
            article._id    = this.props.article._id;
            GameArticlesActions.save(article);
        } else {
            article.author = AuthStore.getUser().username;
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

        if (this.props.type == 'preview') {
            this.refs.imageHome.setImage(null);
            this.refs.imageAway.setImage(null);
            this.refs.central.setToggled(false);
        }

        this.refs['video-0'].clear();
        this.setState({videosCount: 1});
    },

    _onCentral: function (e, central) {
        this.setState({central: central});
    },

    _addVideo: function () {
        this.setState({videosCount: this.state.videosCount + 1});
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
                                ref="central"/>
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
                        ref="imageHome"/>

                    <ImageUpload
                        label="Select away team image (required if match is central)"
                        image={this.props.article.imageAway}
                        errorText={this.state.validation.imageAway ? 'Загрузите изображение для команды гостей' : null}
                        width="360px"
                        height="300px"
                        className={this.state.central ? '' : 's_display_none'}
                        key={this.props.article._id + '-image-away-upload'}
                        ref="imageAway"/>
                </div>
            )
        }

        var videos = [];
        if (this.props.article.video && this.props.article.video.length) {
            videos = this.props.article.video.map(function (item, index) {
                return <VideoUpload type={item.type} label={item.label} url={item.url} ref={'video-' + index} key={'video-' + index}/>
            });
        }
        var start = this.props.article.video ? this.props.article.video.length : 0;
        for (var i = start; i < this.state.videosCount; i++) {
            videos.push(<VideoUpload ref={'video-' + i} key={'video-' + i}/>);
        }
        return (
            <div>
                <MediumEditor
                    hintText="Введите текст"
                    placehoder="Статья"
                    defaultValue={this.props.article.body}
                    errorText={this.state.validation.body ? 'Поле не может быть пустым' : null}
                    key={this.props.article._id}
                    ref="body"/>

                <div className="s_mb_24 s_position_relative block_videos">
                    <div className="block_videos__button-add">
                        <IconButton iconClassName="mdfi_content_add_circle_outline" onClick={this._addVideo}/>
                    </div>

                    {videos}
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
                                ref="show"/>
                        </div>
                    </div>

                    <div className="buttons s_float_r s_width_quarter">
                        <Button className="button_type_cancel s_mt_12" label="Отменить" secondary={true} onClick={this._onCancel}/>
                        <Button className="button_type_save s_float_r s_mt_12" label="Сохранить" disabled={this.state.saving} primary={true}
                                onClick={this._onSave}/>
                    </div>

                    {preview}
                </div>
            </div>
        );
    }
});

module.exports = GameArticleForm;
