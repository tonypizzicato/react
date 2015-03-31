"use strict";

var _                   = require('underscore'),
    React               = require('react'),
    mui                 = require('material-ui'),

    Tabs                = mui.Tabs,
    Tab                 = mui.Tab,

    Toolbar             = require('./GamesToolbar.jsx'),
    GameArticleForm     = require('../game-articles/GameArticleForm.jsx'),

    Dropzone            = require('../Dropzone.jsx'),
    Photos              = require('../Photos.jsx'),

    AuthStore           = require('../../stores/AuthStore'),

    PhotosStore         = require('../../stores/PhotosStore'),
    PhotosActions       = require('../../actions/PhotosActions'),

    GameArticlesStore   = require('../../stores/GameArticlesStore'),
    GameArticlesActions = require('../../actions/GameArticlesActions');

var GamesTab = React.createClass({

    propTypes: function () {
        return {
            leagueId:    React.PropTypes.string.required,
            countries:   React.PropTypes.array,
            onTabChange: React.PropTypes.func
        }
    },

    getDefaultProps: function () {
        return {
            countries: []
        }
    },

    getInitialState: function () {
        return {
            country:    {},
            tournament: {},
            game:       {},
            articles:   [],
            photos:     [],
            article:    {}
        }
    },

    componentDidMount: function () {
        PhotosStore.addChangeListener(this._photosChange);
        GameArticlesStore.addChangeListener(this._articleChange);

        GameArticlesActions.load();
    },

    componentWillUnmount: function () {
        PhotosStore.removeChangeListener(this._photosChange);
        GameArticlesStore.removeChangeListener(this._articleChange);
    },

    _articleChange: function () {
        this.setState({articles: GameArticlesStore.getAll()});
    },

    _photosChange: function () {
        this.setState({photos: PhotosStore.getAll()});
    },

    _onGameSelect: function (game) {
        this.setState({game: game});
        PhotosActions.load('games', game._id);
    },

    _onArticleCancel: function () {
        this.setState({
            article: this.getInitialState().article
        });
    },

    _onGameTabChange: function () {
        this.setState({
            article: this.getInitialState().article
        });
    },

    _onPhotosUpload: function () {
        if (!!this.state.game._id) {
            _.delay(function () {
                PhotosActions.load('games', this.state.game._id);
            }.bind(this), 1000);
        }
    },

    render: function () {
        var toolbar = <Toolbar leagueId={this.props.leagueId} games={this.props.games} onGameSelect={this._onGameSelect}/>;
        var tabsContent;

        if (!!this.state.game._id) {
            var preview = GameArticlesStore.get(this.state.game._id, 'preview'),
                review = GameArticlesStore.get(this.state.game._id, 'review'),
                imagesUrl = PhotosStore.getImagesUrl('games', this.state.game._id) + '?user=' + AuthStore.getUser().username + '&tournament=' + this.state.game.tournamentId;

            tabsContent = (
                <Tabs className="s_mt_12" onChange={this._onGameTabChange}>
                    <Tab label="Превью">
                        <GameArticleForm
                            type="preview"
                            game={this.state.game}
                            article={preview}
                            onCancel={this._onArticleCancel}
                            key={this.state.game._id + '-preview'}/>
                    </Tab>
                    <Tab label="Обзор">
                        <GameArticleForm
                            type="review"
                            game={this.state.game}
                            article={review}
                            onCancel={this._onArticleCancel}
                            key={this.state.game._id + '-review'}/>
                    </Tab>
                    <Tab label="Фото" key={this.state.game._id + '-media'}>
                        <Dropzone
                            url={imagesUrl}
                            onUpload={this._onPhotosUpload}
                            key={this.state.game._id + '-dropzone'}/>
                        <Photos
                            className="s_display_inline-block s_mt_12 s_mr_6 s_position_relative"
                            size="150"
                            photos={this.state.photos}
                            game={this.state.game}
                            key={this.state.game._id + '-photos'}/>
                    </Tab>
                </Tabs>
            );
        } else {
            tabsContent = (
                <div className="text_align_c font-weight_bold s_mt_24">Сначала выберите игру</div>
            )
        }

        return (
            <div className="s_mt_12">
                {toolbar}
                {tabsContent}
            </div>
        );
    }
});

module.exports = GamesTab;