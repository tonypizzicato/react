const _                   = require('lodash'),
      React               = require('react'),
      mui                 = require('material-ui'),

      Spacing             = mui.Styles.Spacing,
      Colors              = mui.Styles.Colors,

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

class GameArticleForm extends React.Component {
    static propTypes = {
        leagueId: React.PropTypes.string.required,
        type:     React.PropTypes.string.required,
        article:  React.PropTypes.object,
        game:     React.PropTypes.object
    };

    static defaultProps = {
        article: {},
        game:    {}
    };

    state = {
        saving:      false,
        article:     this.props.article,
        validation:  {},
        central:     this.props.article.centralGame,
        videosCount: this.props.article.video ? (this.props.article.video.length ? this.props.article.video.length : 1) : 1
    };

    constructor(props) {
        super(props);

        this._onSave            = this._onSave.bind(this);
        this._onCancel          = this._onCancel.bind(this);
        this._addVideo          = this._addVideo.bind(this);
        this._onCentral         = this._onCentral.bind(this);
        this._onValidationError = this._onValidationError.bind(this);
    }

    componentDidMount() {
        GameArticlesStore.addValidationListener(this._onValidationError);
    }

    componentWillUnmount() {
        GameArticlesStore.removeValidationListener(this._onValidationError);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.article.hasOwnProperty('_id')) {
            this._clearForm();
        }
        this.setState({saving: false});
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onSave() {
        let article = {
            body:       this.refs.body.getValue(),
            show:       this.refs.show.isToggled(),
            type:       this.props.type,
            leagueId:   this.props.leagueId,
            tournament: this.props.game.tournamentId,
            gameId:     this.props.game._id
        };

        let videos = [],
            video;
        for (let i = 0; i < this.state.videosCount; i++) {
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
            validation: {},
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
    }

    _onCancel() {
        this._clearForm();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    _clearForm() {
        this.setState({});

        this.refs.body.setValue('');
        this.refs.show.setToggled(false);

        if (this.props.type == 'preview') {
            this.refs.imageHome.setImage(null);
            this.refs.imageAway.setImage(null);
            this.refs.central.setToggled(false);
        }

        this.refs['video-0'].clear();
        this.setState({
            validation:  {},
            videosCount: 1
        });
    }

    _onCentral(e, central) {
        this.setState({central: central});
    }

    _addVideo() {
        this.setState({videosCount: this.state.videosCount + 1});
    }

    render() {
        const styles = this.getStyles();

        let preview;
        if (this.props.type == 'preview') {
            preview = (
                <div>
                    <Toggle
                        style={styles.toggle}
                        name="central"
                        value="central"
                        label="Центральный"
                        labelPosition="right"
                        defaultToggled={this.props.article.centralGame}
                        key={this.props.article._id + '-central'}
                        onToggle={this._onCentral}
                        ref="central"/>

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

        let videos = [];
        if (this.props.article.video && this.props.article.video.length) {
            videos = this.props.article.video.map((item, index) => {
                return <VideoUpload type={item.type} label={item.label} url={item.url} ref={'video-' + index} key={'video-' + index}/>
            });
        }
        const start = this.props.article.video ? this.props.article.video.length : 0;
        for (let i = start; i < this.state.videosCount; i++) {
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

                <Toggle
                    style={styles.toggle}
                    name="show"
                    value="show"
                    label="Показывать"
                    labelPosition="right"
                    defaultToggled={this.props.article.show}
                    key={this.props.article._id + '-show'}
                    ref="show"/>

                <Button style={styles.button} label="Отменить" secondary={true} onClick={this._onCancel}/>
                <Button style={styles.button} label="Сохранить" disabled={this.state.saving} primary={true} onClick={this._onSave}/>

                {preview}
            </div>
        );
    }

    getStyles() {
        return {
            root:       {
                marginBottom: Spacing.desktopGutter,
                padding:      `0 ${Spacing.desktopGutter}px`
            },
            input:      {
                width: '100%'
            },
            radioGroup: {
                margin: `${Spacing.desktopGutter}px 0 0`
            },
            toggle:     {
                height:       Spacing.desktopGutter,
                marginTop:    Spacing.desktopGutter,
                marginBottom: Spacing.desktopGutter,
                marginRight:  Spacing.desktopGutter
            },
            button:     {
                marginRight: Spacing.desktopGutter
            },
            dropdown:   {
                root:      {
                    width: 200
                },
                label:     {
                    paddingLeft: 0
                },
                underline: {
                    margin: '-1px 12px 0 0'
                }
            }
        }
    }
}

module.exports = GameArticleForm;
