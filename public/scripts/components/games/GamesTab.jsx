import _ from 'lodash';
import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import HelpButton from '../HelpButton.jsx';
import Dropzone from '../Dropzone.jsx';
import Photos from '../Photos.jsx';

import HelpPhotoDialog from '../help/HelpPhotoDialog.jsx';
import HelpReviewDialog from '../help/HelpReviewDialog.jsx';

import Toolbar from './GamesToolbar.jsx';
import GameArticleForm from '../game-articles/GameArticleForm.jsx';

import EventsConstants from '../../constants/EventsConstants';
import AuthStore from'../../stores/AuthStore';

import GameArticlesActions from'../../actions/GameArticlesActions';
import GameArticlesStore from'../../stores/GameArticlesStore';
import PhotosActions from'../../actions/PhotosActions';
import PhotosStore from'../../stores/PhotosStore';

class GamesTab extends Component {

    static propTypes = {
        leagueId:    PropTypes.string.isRequired,
        countries:   PropTypes.array,
        onTabChange: PropTypes.func
    };

    static defaultProps = {
        countries: []
    };

    state = {
        activeTab:  0,
        country:    {},
        tournament: {},
        game:       {},
        articles:   [],
        photos:     [],
        article:    {}
    };

    constructor(props) {
        super(props);

        this._onArticleCancel = this._onArticleCancel.bind(this);
        this._articleChange   = this._articleChange.bind(this);
        this._photosChange    = this._photosChange.bind(this);
        this._onGameSelect    = this._onGameSelect.bind(this);
        this._onTabChange     = this._onTabChange.bind(this);
        this._onPhotosUpload  = this._onPhotosUpload.bind(this);
    }

    componentDidMount() {
        PhotosStore.addChangeListener(this._photosChange);
        GameArticlesStore.addChangeListener(this._articleChange);

        GameArticlesActions.load();
    }

    componentWillUnmount() {
        PhotosStore.removeChangeListener(this._photosChange);
        GameArticlesStore.removeChangeListener(this._articleChange);
    }

    _articleChange() {
        this.setState({articles: GameArticlesStore.getAll()});
    }

    _photosChange() {
        this.setState({photos: PhotosStore.getAll()});
    }

    _onGameSelect(game) {
        this.setState({game: game});
        PhotosActions.load('games', game._id);
    }

    _onArticleCancel() {
        this.setState({
            article: {}
        });
    }

    _onTabChange(tab) {
        this.setState({
            activeTab: tab.props.tabIndex,
            article:   {}
        });
    }

    _onPhotosUpload() {
        if (!!this.state.game._id) {
            _.delay(function () {
                PhotosActions.load('games', this.state.game._id);
            }.bind(this), 300);
        }
    }

    render() {
        const styles = this.getStyles();

        let tabsContent;

        if (!!this.state.game._id) {
            tabsContent = (
                <Tabs style={styles.tabs}>
                    <Tab label="Превью" onActive={this._onTabChange}>
                        {this._getPreviewTab(0)}
                    </Tab>
                    <Tab label="Обзор" onActive={this._onTabChange}>
                        {this._getReviewTab(1)}
                    </Tab>
                    <Tab label="Фото" onActive={this._onTabChange}>
                        {this._getPhotoTab(2)}
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
                <Toolbar leagueId={this.props.leagueId} games={this.props.games} onGameSelect={this._onGameSelect}/>
                {tabsContent}
                <HelpPhotoDialog ref="dialogPhoto"/>
                <HelpReviewDialog ref="dialogReview"/>
            </div>
        );
    }

    _getPreviewTab(index) {
        if (this.state.activeTab != index) {
            return;
        }

        const preview = GameArticlesStore.get(this.state.game._id, 'preview');

        return (
            <div>
                <HelpButton dialog={this.refs.dialogReview}/>
                <GameArticleForm
                    type="preview"
                    leagueId={this.props.leagueId}
                    game={this.state.game}
                    article={preview}
                    onCancel={this._onArticleCancel}
                    key={`${this.state.game._id}-preview`}/>
            </div>
        )
    }

    _getReviewTab(index) {
        if (this.state.activeTab != index) {
            return;
        }

        const review = GameArticlesStore.get(this.state.game._id, 'review');

        return (
            <div>
                <HelpButton dialog={this.refs.dialogReview}/>
                <GameArticleForm
                    type="review"
                    leagueId={this.props.leagueId}
                    game={this.state.game}
                    article={review}
                    onCancel={this._onArticleCancel}
                    key={`${this.state.game._id}-review`}/>
            </div>
        )
    }

    _getPhotoTab(index) {
        if (this.state.activeTab != index) {
            return;
        }

        const imagesUrl = PhotosStore.getImagesUrl('games', this.state.game._id) +
            '?user=' + AuthStore.getUser().username + '&tournament=' + this.state.game.tournamentId;

        return (
            <div>
                <HelpButton dialog={this.refs.dialogPhoto}/>
                <Dropzone
                    url={imagesUrl}
                    onChunkUpload={this._onPhotosUpload}
                    key={this.state.game._id + '-dropzone'}/>
                <Photos
                    className="s_display_inline-block s_mt_12 s_mr_6 s_position_relative"
                    size="150"
                    photos={this.state.photos}
                    game={this.state.game}
                    key={this.state.game._id + '-photos'}/>
            </div>
        )
    }

    getStyles() {
        return {
            tabs: {
                marginBottom: Spacing.desktopGutterLess
            }
        }
    }
}

module.exports = GamesTab;
