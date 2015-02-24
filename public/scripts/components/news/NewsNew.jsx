"use strict";

var React                = require('react'),
    mui                  = require('material-ui'),

    Paper                = mui.Paper,
    TextField            = mui.TextField,
    Toggle               = mui.Toggle,
    DropDownMenu         = mui.DropDownMenu,
    Button               = mui.RaisedButton,
    FloatingActionButton = mui.FloatingActionButton,

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

    getInitialState: function () {
        return {
            article:    {
                title: '',
                body:  '',
                show:  true,
                stick: false,
                tags:  []
            },
            validation: {}
        }
    },

    _onSave: function () {
        var article = {
            title: this.refs.title.getValue(),
            body:  this.refs.body.getValue(),
            show:  this.refs.show.isToggled(),
            stick: this.refs.stick.isToggled(),
            tags:  this.refs.tags.getTags()
        };

        this.setState({article: article, validation: {}});
        NewsActions.add(article);
    },

    _onChange: function () {
        this.setState(this.getInitialState());

        this.refs.title.setValue(this.state.article.title);
        this.refs.body.setValue(this.state.article.body);
        this.refs.show.setToggled(this.state.article.show);
        this.refs.stick.setToggled(this.state.article.stick);
        this.refs.tags.setTags(this.state.article.tags);
    },

    _onValidationError: function (validation) {
        console.dir(validation);
        this.setState({validation: validation});
    },

    _handleFile: function (e) {
        console.log('file handled');
        var file = e.target.files[0];
        var formData = new FormData();
        formData.append('file', file, file.name);
    },

    componentDidMount: function () {
        NewsStore.addChangeListener(this._onChange);
        NewsStore.addValidationListener(this._onValidationError);
    },

    componentWillUnmount: function () {
        NewsStore.removeChangeListener(this._onChange);
        NewsStore.removeValidationListener(this._onValidationError);
    },

    render: function () {
        return (
            <Paper>
                <div className="panel panel_type_news-create s_pt_0">
                    <TextField
                        className="s_display_block"
                        defaultValue={this.state.article.title}
                        hintText="Введите название новсти"
                        floatingLabelText="Название"
                        errorText={this.state.validation.title ? 'Поле не может быть пустым' : null}
                        ref="title" />

                    <MediumEditor
                        hintText="Введите тело новости"
                        placehoder="Новость"
                        errorText={this.state.validation.body ? 'Поле не может быть пустым' : null}
                        ref="body" />

                    <div className="s_width_half">
                        <div className="s_width_quarter s_mt_12">
                            <Toggle
                                className="s_mb_12"
                                name="show"
                                value="show"
                                ref="show"
                                defaultToggled={this.state.article.show}
                                label="Show" />
                            <Toggle
                                className="s_mb_12"
                                name="stick"
                                value="stick"
                                ref="stick"
                                defaultToggled={this.state.article.stick}
                                label="Stick" />
                        </div>

                        <div className="s_width_half">
                            <DropDownMenu menuItems={leaguesItems} autoWidth={false} />
                        </div>
                    </div>
                    <div className="s_width_half">
                        <input className="btn btn-default btn-file" type="file" onChange={this._handleFile} accept="image/*;capture=camera"/>
                    </div>
                    <div className="">
                        <div className="s_position_relative s_overflow_hidden s_mt_24">
                            <div className="s_float_l s_width_half">
                                <TagsField ref="tags" floatingLabelText="Tags" tags={this.props.tags} />
                            </div>
                            <div className="s_float_r s_width_half">
                                <Button className="button_type_save s_float_r s_mt_12" label="Save" primary={true} onClick={this._onSave} />
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        )
    }
});


module.exports = NewsNew;
