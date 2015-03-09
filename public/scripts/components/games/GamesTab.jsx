"use strict";

var React               = require('react'),
    mui                 = require('material-ui'),

    Tabs                = mui.Tabs,
    Tab                 = mui.Tab,

    Toolbar             = require('./GamesToolbar.jsx'),
    GameArticleForm     = require('../game-articles/GameArticleForm.jsx'),

    Editor              = require('../MediumEditor.jsx'),
    Dropzone            = require('../Dropzone.jsx'),
    Photos              = require('../Photos.jsx'),

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
        GameArticlesStore.addChangeListener(this._articlesChange);
        PhotosStore.addChangeListener(this._photosChange);

        GameArticlesActions.load();
    },

    componentWillUnmount: function () {
        GameArticlesStore.removeChangeListener(this._articlesChange);
        PhotosStore.removeChangeListener(this._photosChange);
    },

    _articlesChange: function () {
        console.dir(GameArticlesStore.getAll())
    },

    _photosChange: function () {
        this.setState({photos: PhotosStore.getAll()});
    },

    _onTabChange: function (tab) {
        if (this.props.onTabChange) {
            this.props.onTabChange(tab);
        }
    },

    _onGameSelect: function (game) {
        console.log('game selected');
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
            PhotosActions.load('games', this.state.game._id);
        }
    },

    render: function () {
        var toolbar = <Toolbar leagueId={this.props.leagueId} onGameSelect={this._onGameSelect}/>;
        var tabsContent;

        if (!!this.state.game._id) {
            var preview = GameArticlesStore.get(this.state.game._id, 'preview'),
                review  = GameArticlesStore.get(this.state.game._id, 'review');

            tabsContent = (
                <Tabs className="s_mt_12" onChange={this._onGameTabChange}>
                    <Tab label="Preview">
                        <GameArticleForm type="preview" game={this.state.game} article={preview}
                                         onCancel={this._onArticleCancel}
                                         key={this.state.game._id + '-preview'}/>
                    </Tab>
                    <Tab label="Review">
                        <GameArticleForm type="review" game={this.state.game} article={review}
                                         onCancel={this._onArticleCancel}
                                         key={this.state.game._id + '-review'}/>
                    </Tab>
                    <Tab label="Media" key={this.state.game._id + '-photo'}>
                        <Dropzone
                            url={PhotosStore.getImagesUrl('games', this.state.game._id)}
                            onUpload={this._onPhotosUpload}
                            key={this.state.game._id + '-dropzone'}/>
                        <Photos
                            className="s_display_inline-block s_mt_12 s_mr_6 s_position_relative"
                            size="150"
                            photos={this.state.photos}
                            key={this.state.game._id + '-photos'}/>
                    </Tab>
                </Tabs>
            );
        } else {
            tabsContent = (
                <div className="text_align_c font-weight_bold s_mt_24">Select game first</div>
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