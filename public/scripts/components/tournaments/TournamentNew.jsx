"use strict";

var assign             = require('object-assign'),
    React              = require('react'),
    mui                = require('material-ui'),

    Paper              = mui.Paper,
    TextField          = mui.TextField,
    Toggle             = mui.Toggle,
    RadioButtonGroup   = mui.RadioButtonGroup,
    RadioButton        = mui.RadioButton,
    Button             = mui.RaisedButton,
    DropDownMenu       = mui.DropDownMenu,

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
                leagueId: null,
                country:  null
            },
            countries:  []
        }
    },

    getInitialState: function () {
        return {
            country:    this.props.tournament.country ? this.props.tournament.country : null,
            validation: {}
        }
    },

    componentDidMount: function () {
        TournamentsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    componentWillUnmount: function () {
        TournamentsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    },

    _onValidationError: function (validation) {
        this.setState({validation: validation});
    },

    _onCountryChange: function (e, index, item) {
        this.setState({country: item});
    },

    _onSave: function () {
        var tournament = {
            name:     this.refs.name.getValue(),
            slug:     this.refs.slug.getValue(),
            state:    this.refs.state.getSelectedValue(),
            country:  this.state.country,
            leagueId: this.props.leagueId
        };

        this.setState({validation: {}});
        if (this.props.tournament._id) {
            tournament.id = this.props.tournament._id;
            TournamentsActions.save(tournament);
        } else {
            TournamentsActions.add(tournament);
        }
    },

    render: function () {
        var selectedCountryIndex = 0;
        var countryItems = this.props.countries.map(function (country, index) {
            if (this.state.country) {
                if (this.state.country._id == country._id) {
                    selectedCountryIndex = index;
                }
            } else if (this.props.tournament.country && country._id == this.props.tournament.country._id) {
                selectedCountryIndex = index;
            }
            return {text: country.name, _id: country._id, name: country.name};
        }.bind(this));

        var disabled = !this.props.tournament._id;
        return (
            <div className="panel panel_type_tournament-create s_pt_0">
                <TextField
                    defaultValue={this.props.tournament.name}
                    hintText="Введите название турнира"
                    floatingLabelText="Название"
                    disabled={true}
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name" />

                <TextField
                    defaultValue={this.props.tournament.slug}
                    hintText="Введите url турнира (пример: bpl)"
                    placehoder="URL"
                    floatingLabelText="URL"
                    disabled={disabled}
                    errorText={this.state.validation.slug ? 'Поле не может быть пустым' : null}
                    ref="slug" />

                <DropDownMenu
                    className="s_width_half"
                    menuItems={countryItems}
                    selectedIndex={selectedCountryIndex}
                    autoWidth={false}
                    onChange={this._onCountryChange}
                    ref="country" />

                <div className="s_position_relative s_overflow_hidden s_mt_24">
                    <div className="s_float_l s_width_half">
                        <RadioButtonGroup
                            name="state"
                            defaultSelected={this.props.tournament.state ? this.props.tournament.state : 'CREATED'}
                            ref="state" >
                            <RadioButton
                                value="CREATED"
                                label="CREATED"
                                disabled={true} />
                            <RadioButton
                                value="IN PROGRESS"
                                label="IN PROGRESS"
                                disabled={true} />
                            <RadioButton
                                value="ARCHIVE"
                                label="ARCHIVE"
                                disabled={true} />
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
