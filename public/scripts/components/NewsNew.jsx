"use strict";

var React                = require('react'),
    mui                  = require('material-ui'),

    Paper                = mui.Paper,
    TextField            = mui.TextField,
    Toggle               = mui.Toggle,
    DropDownMenu         = mui.DropDownMenu,
    Button               = mui.RaisedButton,
    FloatingActionButton = mui.FloatingActionButton,

    NewsActions          = require('../actions/NewsActions'),
    NewsStore            = require('../stores/NewsStore'),

    TagsField            = require('./TagsField.jsx');

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
                stick: false
            },
            validation: {}
        }
    },

    _onSave: function () {
        var article = {
            title: this.refs.title.getValue(),
            body:  this.refs.body.getValue(),
            show:  this.refs.show.isToggled(),
            stick: this.refs.stick.isToggled()
        };
        this.setState({article: article, validation: {}});
        NewsActions.save(article);
    },

    _onChange: function () {
        this.setState(this.getInitialState());

        this.refs.title.setValue(this.state.article.title);
        this.refs.body.setValue(this.state.article.body);
        this.refs.show.setToggled(this.state.article.show);
        this.refs.stick.setToggled(this.state.article.stick);
    },

    componentDidMount: function () {
        NewsStore.addChangeListener(this._onChange);
        NewsStore.addValidationListener(this._onValidationError);
    },

    componentWillUnmount: function () {
        NewsStore.removeChangeListener(this._onChange);
        NewsStore.removeValidationListener(this._onValidationError);
    },

    _onValidationError: function (validation) {
        console.dir(validation);
        this.setState({validation: validation});
    },

    _saveTags: function () {
        console.log('saved tags: ' + this.refs.tags.getTags().join(', '));
    },

    render: function () {
        return (
            <Paper>
                <div className="panel">
                    <TextField
                        className="s_display_block"
                        defaultValue={this.state.article.title}
                        hintText="Введите название новсти"
                        ref="title"
                        floatingLabelText="Название"
                        errorText={this.state.validation.title ? 'Поле не может быть пустым' : null} />
                    <TextField
                        className="s_display_block"
                        defaultValue={this.state.article.body}
                        hintText="Введите тело новости"
                        ref="body"
                        floatingLabelText="Новость"
                        multiLine={true}
                        errorText={this.state.validation.body ? 'Поле не может быть пустым' : null} />

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

                        <DropDownMenu menuItems={leaguesItems} autoWidth={false} />
                    </div>


                    <div className="s_position_relative s_overflow_hidden s_mt_24">
                        <div className="s_float_l">
                            <TagsField floatingLabelText="Tags" tags={['tag1', 'tag2']}/>
                        </div>

                        <Button className="s_float_r s_mt_12" label="Save" primary={true} onClick={this._onSave} />
                    </div>
                </div>
            </Paper>
        )
    }
});


module.exports = NewsNew;