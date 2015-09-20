"use strict";

var React                = require('react'),
    mui                  = require('material-ui'),

    Paper                = mui.Paper,
    TextField            = mui.TextField,
    Toggle               = mui.Toggle,
    DropDownMenu         = mui.DropDownMenu,
    Button               = mui.RaisedButton,
    IconButton           = mui.IconButton,
    FloatingActionButton = mui.FloatingActionButton,
    RadioButtonGroup     = mui.RadioButtonGroup,
    RadioButton          = mui.RadioButton,

    EventsConstants      = require('../../constants/EventsConstants'),

    NewsActions          = require('../../actions/NewsActions'),
    NewsStore            = require('../../stores/NewsStore'),

    AuthStore            = require('../../stores/AuthStore'),

    MediumEditor         = require('../MediumEditor.jsx'),
    TagsField            = require('../TagsField.jsx'),
    ImageUpload          = require('../ImageUpload.jsx'),
    VideoUpload          = require('../VideoUpload.jsx');

var NewsForm = React.createClass({

    getDefaultProps: function () {
        return {
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
    },

    getInitialState: function () {
        return {
            countries:   [],
            article:     this.props.article,
            validation:  {},
            videosCount: this.props.article.video ? (this.props.article.video.length ? this.props.article.video.length : 1) : 1
        };
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    componentDidMount: function () {
        NewsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillUnmount: function () {
        NewsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!nextProps.article.hasOwnProperty('_id')) {
            this._clearForm();
        }
    },

    _onSave: function () {
        var article = {
            title:         this.refs.title.getValue(),
            body:          this.refs.body.getValue(),
            teaser:        this.refs.teaser.getValue(),
            show:          this.refs.show.isToggled(),
            stick:         this.refs.stick.isToggled(),
            tags:          this.refs.tags.getTags(),
            leagueId:      this.props.leagueId,
            category:      this.props.categories[this.refs.category.state.selectedIndex]._id,
            country:       this.props.countries[this.refs.country.state.selectedIndex]._id,
            image:         this.refs.image.getImage(),
            imagePosition: this.refs.imagePositionText.getValue(),
            author:        AuthStore.getUser().username
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

        this.setState({validation: this.getInitialState().validation});
        if (this.props.article._id) {
            article._id = this.props.article._id;
            NewsActions.save(article);
        } else {
            NewsActions.add(article);
        }
    },

    _clearForm: function () {
        this.refs.title.setValue('');
        this.refs.teaser.setValue('');
        this.refs.body.setValue('');
        this.refs.show.setToggled(false);
        this.refs.stick.setToggled(false);
        this.refs.tags.setTags([]);
        this.refs.image.setImage(null);
        this.refs.imagePositionText.setValue('50%');

        this.refs['video-0'].clear();
        this.setState({videosCount: 1});
    },

    _addVideo: function () {
        this.setState({videosCount: this.state.videosCount + 1});
    },

    _onCancel: function () {
        this.setState({article: this.getInitialState().article});
        this._clearForm();
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    _changeImagePosition: function (e) {
        var value = e.target.value;
        this.refs.image.setImagePos(false, value);
        this.refs.imagePositionText.setValue(value);
        this.refs.imagePosition.setSelectedValue(value);
    },

    render: function () {
        var selectedCountryIndex = 0;
        var countryItems         = this.props.countries.map(function (country, index) {
            if (this.props.article.country == country._id) {
                selectedCountryIndex = index;
            }
            return {text: country.name, _id: country._id, name: country.name};
        }.bind(this));

        var selectedCategoryIndex = 0;
        var categoryItems         = this.props.categories.map(function (category, index) {
            if (this.props.article.category == category._id) {
                selectedCategoryIndex = index;
            }
            return {text: category.name, _id: category._id, name: category.name};
        }.bind(this));

        var videos = [];
        if (this.props.article.video && this.props.article.video.length) {
            videos = this.props.article.video.map(function (item, index) {
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
        var start = this.props.article.video ? this.props.article.video.length : 0;
        for (var i = start; i < this.state.videosCount; i++) {
            videos.push(<VideoUpload ref={'video-' + i} key={'video-' + i}/>);
        }

        var categories = categoryItems.length ? (
            <DropDownMenu
                className="s_width_half"
                menuItems={categoryItems}
                selectedIndex={selectedCategoryIndex}
                ref="category"/>
        ) : (<span className="s_display_block s_line-height_62">Нет категории</span>);

        return (
            <div className="panel panel_type_news-create s_pt_0">
                <TextField
                    defaultValue={this.props.article.title}
                    hintText="Введите название новсти"
                    floatingLabelText="Название"
                    errorText={this.state.validation.title ? 'Поле не может быть пустым' : null}
                    ref="title"/>

                <TextField
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

                <div className="s_width_half">
                    {categories}
                    <DropDownMenu
                        className="s_width_half"
                        menuItems={countryItems}
                        selectedIndex={selectedCountryIndex}
                        ref="country"/>
                </div>

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

                <div className="s_mt_24 s_overflow_hidden">
                    <div className="s_float_l" style={{width: '120px;'}}>
                        <RadioButtonGroup name="imagePosition" ref="imagePosition" defaultSelected="center"
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
                    </div>

                    <div className="s_float_l s_mr_24" style={{width: '120px;'}}>
                        <TextField
                            defaultValue={this.props.article.imagePosition ? this.props.article.imagePosition : '50%'}
                            onChange={this._changeImagePosition}
                            ref="imagePositionText"/>
                    </div>

                    <div className="s_width_half s_float_l">
                        <div className="s_width_third s_mt_12 s_mb_12">
                            <Toggle
                                className="s_mb_12"
                                name="show"
                                value="show"
                                ref="show"
                                defaultToggled={this.props.article.show}
                                label="Показывать"/>
                            <Toggle
                                className="s_mb_12"
                                name="stick"
                                value="stick"
                                ref="stick"
                                defaultToggled={this.props.article.stick}
                                label="Прикрепить"/>
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="s_position_relative s_overflow_hidden s_mt_24">
                        <div className="s_float_l s_width_half">
                            <TagsField ref="tags" floatingLabelText="Tags" tags={this.props.article.tags}/>
                        </div>

                        <div className="buttons s_float_r s_width_third">
                            <Button className="button_type_cancel s_mt_36" label="Отменить" secondary={true} onClick={this._onCancel}/>
                            <Button className="button_type_save s_float_r s_mt_36" label="Сохранить" primary={true} onClick={this._onSave}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = NewsForm;
