"use strict";

var React        = require('react'),
    mui          = require('material-ui'),

    Paper        = mui.Paper,
    TextField    = mui.TextField,
    Toggle       = mui.Toggle,
    DropDownMenu = mui.DropDownMenu,
    Button       = mui.RaisedButton,

    NewsActions  = require('../actions/NewsActions');

var leaguesItems = [
    {payload: '0', text: 'All'},
    {payload: '1', text: 'England'},
    {payload: '2', text: 'Spain'},
    {payload: '3', text: 'Italy'},
    {payload: '4', text: 'Germany'},
    {payload: '5', text: 'Winter Championship'}
];

var NewsNew = React.createClass({

    _onSave: function () {
        NewsActions.save(this.refs.title.getValue(), this.refs.body.getValue());
    },

    render: function () {
        return (
            <Paper>
                <div className="panel">
                    <TextField className="s_display_block" hintText="Введите название новсти" ref="title" floatingLabelText="Название" />
                    <TextField className="s_display_block" hintText="Введите тело новости" ref="body" floatingLabelText="Новость" />

                    <div className="s_width_quarter s_mt_12">
                        <Toggle className="s_mb_12" name="show" value="show" defaultToggled={true} label="Show" />
                        <Toggle className="s_mb_12" name="stick" value="stick" defaultToggled={false} label="Stick" />


                        <DropDownMenu menuItems={leaguesItems} autoWidth={false} />
                    </div>

                    <div className="s_position_relative s_overflow_hidden">
                        <Button className="s_float_r s_mt_12" label="Save" primary={true} onClick={this._onSave} />
                    </div>
                </div>
            </Paper>
        )
    }
});


module.exports = NewsNew;