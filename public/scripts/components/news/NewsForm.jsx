"use strict";

var React                = require('react'),
    mui                  = require('material-ui'),

    Paper                = mui.Paper,
    TextField            = mui.TextField,
    Toggle               = mui.Toggle,
    DropDownMenu         = mui.DropDownMenu,
    Button               = mui.RaisedButton,
    FloatingActionButton = mui.FloatingActionButton,

    EventsConstants      = require('../../constants/EventsConstants'),

    NewsActions          = require('../../actions/NewsActions'),
    NewsStore            = require('../../stores/NewsStore'),

    AuthStore            = require('../../stores/AuthStore'),

    MediumEditor         = require('../MediumEditor.jsx'),
    TagsField            = require('../TagsField.jsx'),
    ImageUpload          = require('../ImageUpload.jsx');

var NewsForm = React.createClass({

    getDefaultProps: function () {
        return {
            countries: [],
            article:   {
                title:   '',
                body:    '',
                teaser:  '',
                show:    false,
                stick:   false,
                image:   null,
                country: {},
                tags:    []
            },
            leagueId:  null
        }
    },

    getInitialState: function () {
        return {
            countries:  [],
            article:    this.props.article,
            validation: {}
        }
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
            title:    this.refs.title.getValue(),
            body:     this.refs.body.getValue(),
            teaser:   this.refs.teaser.getValue(),
            show:     this.refs.show.isToggled(),
            stick:    this.refs.stick.isToggled(),
            tags:     this.refs.tags.getTags(),
            leagueId: this.props.leagueId,
            country:  this.props.countries[this.refs.country.state.selectedIndex]._id,
            image:    this.refs.image.getImage(),
            author:   AuthStore.getUser().username
        };

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
    },

    _onCancel: function () {
        this.setState({article: this.getInitialState().article});
        this._clearForm();
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    render: function () {
        var selectedCountryIndex = 0;
        var countryItems = this.props.countries.map(function (country, index) {
            if (this.props.article.country == country._id) {
                selectedCountryIndex = index;
            }
            return {text: country.name, _id: country._id, name: country.name};
        }.bind(this));

        return (
            <div className="panel panel_type_news-create s_pt_0">
                <TextField
                    className="s_display_block"
                    defaultValue={this.props.article.title}
                    hintText="Введите название новсти"
                    floatingLabelText="Название"
                    errorText={this.state.validation.title ? 'Поле не может быть пустым' : null}
                    ref="title" />

                <TextField
                    className="s_display_block"
                    defaultValue={this.props.article.teaser}
                    hintText="Введите короткое описание новости"
                    floatingLabelText="Описание"
                    //errorText={this.state.validation.teaser ? 'Поле не может быть пустым' : null}
                    ref="teaser" />

                <MediumEditor
                    className="s_mb_24"
                    hintText="Введите тело новости"
                    placehoder="Новость"
                    floatingLabelText="Тело новости"
                    defaultValue={this.props.article.body}
                    errorText={this.state.validation.body ? 'Поле не может быть пустым' : null}
                    ref="body" />

                <ImageUpload
                    label="Изображение превью (обязательно если новость закреплена)"
                    image={this.props.article.image}
                    errorText={this.state.validation.image ? 'Загрузите изображение для новости' : null}
                    width="863px"
                    height="308px"
                    key={this.props.article._id + '-image-upload'}
                    ref="image" />

                <div className="s_width_half">
                    <DropDownMenu
                        className="s_width_half"
                        menuItems={countryItems}
                        selectedIndex={selectedCountryIndex}
                        ref="country" />

                    <div className="s_width_third s_mt_12 s_mb_12">
                        <Toggle
                            className="s_mb_12"
                            name="show"
                            value="show"
                            ref="show"
                            defaultToggled={this.props.article.show}
                            label="Показывать" />
                        <Toggle
                            className="s_mb_12"
                            name="stick"
                            value="stick"
                            ref="stick"
                            defaultToggled={this.props.article.stick}
                            label="Прикрепить" />
                    </div>
                </div>

                <div className="">
                    <div className="s_position_relative s_overflow_hidden s_mt_24">
                        <div className="s_float_l s_width_half">
                            <TagsField ref="tags" floatingLabelText="Tags" tags={this.props.article.tags} />
                        </div>

                        <div className="buttons s_float_r s_width_third">
                            <Button className="button_type_cancel s_mt_36" label="Отменить" secondary={true} onClick={this._onCancel} />
                            <Button className="button_type_save s_float_r s_mt_36" label="Сохранить" primary={true} onClick={this._onSave} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = NewsForm;
