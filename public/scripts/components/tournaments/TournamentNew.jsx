"use strict";

var React              = require('react'),
    mui                = require('material-ui'),

    Paper              = mui.Paper,
    TextField          = mui.TextField,
    Toggle             = mui.Toggle,
    RadioButtonGroup   = mui.RadioButtonGroup,
    RadioButton        = mui.RadioButton,
    Button             = mui.RaisedButton,

    EventsConstants    = require('../../constants/EventsConstants'),

    TournamentsActions = require('../../actions/TournamentsActions'),
    TournamentsStore   = require('../../stores/TournamentsStore');

var TournamentNew = React.createClass({

    getDefaultProps: function () {
        return {
            tournament: {
                name:     '',
                slug:     '',
                state:    'CREATED',
                leagueId: null
            },
            countryId:  null
        }
    },

    getInitialState: function () {
        return {
            tournament: this.props.tournament,
            validation: {}
        }
    },

    componentDidMount: function () {
        TournamentsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillUnmount: function () {
        TournamentsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.hasOwnProperty('tournament')) {
            this.setState({tournament: nextProps.tournament});
        }
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    _onSave: function () {
        var tournament = {
            name:     this.refs.name.getValue(),
            slug:     this.refs.slug.getValue(),
            state:    this.refs.state.getSelectedValue(),
            leagueId: this.props.leagueId
        };

        this.setState({tournament: tournament, validation: {}});
        if (this.props.tournament._id) {
            tournament.id = this.props.tournament._id;
            TournamentsActions.save(tournament);
        } else {
            TournamentsActions.add(tournament);
        }
    },

    render: function () {
        return (
            <div className="panel panel_type_tournament-create s_pt_0">
                <TextField
                    defaultValue={this.props.tournament.name}
                    hintText="Введите название турнира"
                    floatingLabelText="Название"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name" />

                <TextField
                    defaultValue={this.props.tournament.slug}
                    hintText="Введите url турнира (пример: bpl)"
                    placehoder="URL"
                    floatingLabelText="URL"
                    errorText={this.state.validation.slug ? 'Поле не может быть пустым' : null}
                    ref="slug" />


                <div className="s_position_relative s_overflow_hidden s_mt_24">
                    <div className="s_float_l s_width_quarter">
                        <RadioButtonGroup
                            name="state"
                            defaultSelected={this.props.tournament.state ? this.props.tournament.state : 'CREATED'}
                            ref="state" >
                            <RadioButton
                                value="CREATED"
                                label="CREATED" />
                            <RadioButton
                                value="ACTIVE"
                                label="ACTIVE" />
                            <RadioButton
                                value="ARCHIVE"
                                label="ARCHIVE" />
                        </RadioButtonGroup>
                    </div>
                    <div className="s_float_r s_width_half">
                        <Button className="button_type_save s_float_r s_mt_36" label="Save" primary={true} onClick={this._onSave} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TournamentNew;
