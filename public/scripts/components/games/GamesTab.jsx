import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

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
import PhotosActions from'../../actions/PhotosActions';
import PhotosStore from'../../stores/PhotosStore';

class GamesTab extends Component {

    static propTypes = {
        leagueId:    PropTypes.string.isRequired,
        countries:   PropTypes.array.isRequired,
        tournaments: PropTypes.array.isRequired,
        games:       PropTypes.array.isRequired,
        articles:    PropTypes.array.isRequired,
        photos:      PropTypes.object.isRequired
    };

    state = {
        activeTab:  0,
        tournament: {},
        game:       {},
        article:    {}
    };

    constructor(props) {
        super(props);

        this._onArticleCancel = this._onArticleCancel.bind(this);
        this._onGameSelect    = this._onGameSelect.bind(this);
        this._onTabChange     = this._onTabChange.bind(this);
        this._onPhotosUpload  = this._onPhotosUpload.bind(this);
    }

    _onGameSelect(game) {
        this.setState({game: game});
        this.props.dispatch(PhotosActions.fetch('games', game._id));
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
                this.props.dispatch(PhotosActions.fetch('games', this.state.game._id));
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
                <Toolbar leagueId={this.props.leagueId}
                         countries={this.props.countries}
                         tournaments={this.props.tournaments}
                         games={this.props.games}
                         onGameSelect={this._onGameSelect}/>

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

        const preview = _.findWhere(this.props.articles, {gameId: this.state.game._id, type: 'preview'});

        return (
            <div>
                <HelpButton onTouchTap={() => this.refs.dialogReview.open()}/>
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

        const review = _.findWhere(this.props.articles, {gameId: this.state.game._id, type: 'review'});

        return (
            <div>
                <HelpButton onTouchTap={() => this.refs.dialogReview.open()}/>
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
                <HelpButton onTouchTap={() => this.refs.dialogPhoto.open()}/>
                <Dropzone
                    url={imagesUrl}
                    onChunkUpload={this._onPhotosUpload}
                    key={this.state.game._id + '-dropzone'}/>
                <Photos
                    className="s_display_inline-block s_mt_12 s_mr_6 s_position_relative"
                    size="150"
                    photos={this.props.photos.items}
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

function mapState(state) {
    return {
        photos: state.get('photos').toJS()
    }
};

export default connect(mapState)(GamesTab);
