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

    MediumEditor         = require('./../MediumEditor.jsx'),
    TagsField            = require('./../TagsField.jsx');

var leaguesItems = [
    {payload: '0', text: 'All'},
    {payload: '1', text: 'England'},
    {payload: '2', text: 'Spain'},
    {payload: '3', text: 'Italy'},
    {payload: '4', text: 'Germany'},
    {payload: '5', text: 'Winter Championship'}
];

var NewsNew = React.createClass({

    getDefaultProps: function () {
        return {
            article:  {
                title:  '',
                body:   '',
                teaser: '',
                show:   false,
                stick:  false,
                tags:   []
            },
            leagueId: null
        }
    },

    getInitialState: function () {
        return {
            article:    this.props.article,
            validation: {}
        }
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    _handleFile: function (e) {
        console.log('file handled');
        var file = e.target.files[0];
        var formData = new FormData();
        formData.append('file', file, file.name);
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
            leagueId: this.props.leagueId
        };

        this.setState({article: article, validation: {}});
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
    },

    _onCancel: function () {
        this.setState({article: this.getInitialState().article});
        this._clearForm();
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    render: function () {
        return (
            <Paper>
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
                        defaultValue={this.props.article.body}
                        errorText={this.state.validation.body ? 'Поле не может быть пустым' : null}
                        ref="body" />

                    <div className="s_width_half">
                        <DropDownMenu menuItems={leaguesItems} autoWidth={false} />

                        <div className="s_width_quarter s_mt_12 s_mb_12">
                            <Toggle
                                className="s_mb_12"
                                name="show"
                                value="show"
                                ref="show"
                                defaultToggled={this.props.article.show}
                                label="Show" />
                            <Toggle
                                className="s_mb_12"
                                name="stick"
                                value="stick"
                                ref="stick"
                                defaultToggled={this.props.article.stick}
                                label="Stick" />
                        </div>
                    </div>

                    <div className="s_width_half">
                        <input className="btn btn-default btn-file" type="file" onChange={this._handleFile} accept="image/*;capture=camera"/>
                    </div>
                    <div className="">
                        <div className="s_position_relative s_overflow_hidden s_mt_24">
                            <div className="s_float_l s_width_half">
                                <TagsField ref="tags" floatingLabelText="Tags" tags={this.props.article.tags} />
                            </div>

                            <div className="buttons s_float_r s_width_quarter">
                                <Button className="button_type_cancel s_mt_36" label="Cancel" secondary={true} onClick={this._onCancel} />
                                <Button className="button_type_save s_float_r s_mt_36" label="Save" primary={true} onClick={this._onSave} />
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        )
    }
});


module.exports = NewsNew;
