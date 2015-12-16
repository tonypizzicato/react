import _ from 'lodash';
import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import Button from 'material-ui/lib/raised-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import RadioButton from 'material-ui/lib/radio-button';

import MediumEditor from '../MediumEditor.jsx';
import ImageUpload from '../ImageUpload.jsx';
import VideoUpload from '../VideoUpload.jsx';
import TagsField from '../TagsField.jsx';

import EventsConstants from '../../constants/EventsConstants';
import AuthStore from'../../stores/AuthStore';

import NewsActions from'../../actions/NewsActions';
import NewsStore from'../../stores/NewsStore';

class NewsForm extends Component {

    static defaultProps = {
        categories: [],
        countries:  [],
        article:    {
            title:   '',
            body:    '',
            teaser:  '',
            show:    false,
            stick:   false,
            image:   null,
            country: {},
            tags:    [],
            video:   []
        },
        leagueId:   null
    };

    state = {
        countries:   [],
        article:     this.props.article,
        validation:  {},
        videosCount: this.props.article.video ? (this.props.article.video.length ? this.props.article.video.length : 1) : 1
    };

    constructor(props) {
        super(props);

        this._onSave              = this._onSave.bind(this);
        this._onCancel            = this._onCancel.bind(this);
        this._onValidationError   = this._onValidationError.bind(this);
        this._changeImagePosition = this._changeImagePosition.bind(this);
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    componentDidMount() {
        NewsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillUnmount() {
        NewsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.article.hasOwnProperty('_id')) {
            this._clearForm();
        }
    }

    _onSave() {
        let article = {
            title:         this.refs.title.getValue(),
            body:          this.refs.body.getValue(),
            teaser:        this.refs.teaser.getValue(),
            show:          this.refs.show.isToggled(),
            stick:         this.refs.stick.isToggled(),
            //tags:     this.refs.tags.getTags(),
            leagueId:      this.props.leagueId,
            category:      this.props.categories[this.refs.category.state.selectedIndex]._id,
            country:       this.props.countries[this.refs.country.state.selectedIndex]._id,
            image:         this.refs.image.getImage(),
            imagePosition: this.refs.imagePositionText.getValue(),
            author:        AuthStore.getUser().username
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

        this.setState({validation: {}});

        if (this.props.article._id) {
            article._id = this.props.article._id;
            NewsActions.save(article);
        } else {
            NewsActions.add(article);
        }
    }

    _clearForm() {
        this.refs.title.setValue('');
        this.refs.teaser.setValue('');
        this.refs.body.setValue('');
        this.refs.show.setToggled(false);
        this.refs.stick.setToggled(false);
        //this.refs.tags.setTags([]);
        this.refs.image.setImage(null);
        this.refs.imagePositionText.setValue('50%');

        this.refs['video-0'].clear();
        this.setState({videosCount: 1});
    }

    _onCancel() {
        this.setState({article: this.props.article});
        this._clearForm();
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    _changeImagePosition(e) {
        var value = e.target.value;
        this.refs.image.setImagePos(false, value);
        this.refs.imagePositionText.setValue(value);
        this.refs.imagePosition.setSelectedValue(value);
    }

    render() {
        const styles             = this.getStyles();
        let selectedCountryIndex = 0;
        const countryItems       = this.props.countries.map((country, index) => {
            if (this.props.article.country == country._id) {
                selectedCountryIndex = index;
            }

            return {text: country.name, _id: country._id, name: country.name};
        });

        let selectedCategoryIndex = 0;
        const categoryItems       = this.props.categories.map((category, index) => {
            if (this.props.article.category == category._id) {
                selectedCategoryIndex = index;
            }

            return {text: category.name, _id: category._id, name: category.name};
        });

        let videos = [];
        if (this.props.article.video && this.props.article.video.length) {
            videos = this.props.article.video.map((item, index) => {
                return (
                    <VideoUpload
                        type={item.type}
                        label={item.label}
                        url={item.url}
                        ref={'video-' + index}
                        key={'video-' + index}/>
                );
            });
        }
        const start = this.props.article.video ? this.props.article.video.length : 0;
        for (let i = start; i < this.state.videosCount; i++) {
            videos.push(<VideoUpload ref={'video-' + i} key={'video-' + i}/>);
        }

        const categories = categoryItems.length ? (
            <DropDownMenu
                style={styles.dropdown.root}
                labelStyle={styles.dropdown.label}
                underlineStyle={styles.dropdown.underline}
                menuItems={categoryItems}
                selectedIndex={selectedCategoryIndex}
                ref="category"/>
        ) : (<span className="s_display_block s_line-height_62">Нет категории</span>);

        return (
            <div style={styles.root}>
                <TextField
                    style={styles.input}
                    defaultValue={this.props.article.title}
                    hintText="Введите название новсти"
                    floatingLabelText="Название"
                    errorText={this.state.validation.title ? 'Поле не может быть пустым' : null}
                    ref="title"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.article.teaser}
                    hintText="Введите короткое описание новости"
                    floatingLabelText="Описание"
                    //errorText={this.state.validation.teaser ? 'Поле не может быть пустым' : null}
                    ref="teaser"/>

                <MediumEditor
                    hintText="Введите тело новости"
                    placehoder="Новость"
                    floatingLabelText="Тело новости"
                    defaultValue={this.props.article.body}
                    errorText={this.state.validation.body ? 'Поле не может быть пустым' : null}
                    ref="body"/>

                {categories}
                <DropDownMenu
                    style={styles.dropdown.root}
                    labelStyle={styles.dropdown.label}
                    underlineStyle={styles.dropdown.underline}
                    menuItems={countryItems}
                    selectedIndex={selectedCountryIndex}
                    ref="country"/>

                {videos}

                <ImageUpload
                    label="Изображение превью (обязательно если новость закреплена)"
                    image={this.props.article.image}
                    pos={{x: '50%', y: this.props.article.imagePosition ? this.props.article.imagePosition : '50%'}}
                    errorText={this.state.validation.image ? 'Загрузите изображение для новости' : null}
                    width="863px"
                    height="308px"
                    key={this.props.article._id + '-image-upload'}
                    ref="image"/>

                <RadioButtonGroup style={styles.radioGroup} name="imagePosition" ref="imagePosition" defaultSelected="center"
                                  valueSelected={this.props.article.imagePosition ? this.props.article.imagePosition : '50%'}
                                  onChange={this._changeImagePosition}>
                    <RadioButton
                        value="50%"
                        label="Центр"
                        defaultChecked={true}
                        />
                    <RadioButton
                        value="0"
                        label="Верх"
                        />
                    <RadioButton
                        value="100%"
                        label="Низ"
                        />
                </RadioButtonGroup>

                <TextField
                    defaultValue={this.props.article.imagePosition ? this.props.article.imagePosition : '50%'}
                    onChange={this._changeImagePosition}
                    ref="imagePositionText"/>

                <Toggle
                    style={styles.toggle}
                    name="show"
                    value="show"
                    ref="show"
                    labelPosition="right"
                    defaultToggled={this.props.article.show}
                    label="Показывать"/>
                <Toggle
                    style={styles.toggle}
                    name="stick"
                    value="stick"
                    ref="stick"
                    labelPosition="right"
                    defaultToggled={this.props.article.stick}
                    label="Прикрепить"/>

                <Button style={styles.button} label="Отменить" secondary={true} onClick={this._onCancel}/>
                <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSave}/>
            </div>
        )
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

module.exports = NewsForm;
