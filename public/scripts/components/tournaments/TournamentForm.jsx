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

var TournamentForm = React.createClass({

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
            _id:      this.props.tournament._id,
            name:     this.refs.name.getValue(),
            slug:     this.refs.slug.getValue(),
            vk:       this.refs.vk.getValue(),
            state:    this.refs.state.getSelectedValue(),
            country:  this.props.countries[this.refs.country.state.selectedIndex],
            leagueId: this.props.leagueId,
            show:     this.refs.show.isToggled()
        };

        this.setState({validation: {}});
        TournamentsActions.save(tournament);
    },

    _onCancel: function () {
        this.setState({validation: this.getInitialState().validation});

        if (this.props.onCancel) {
            this.props.onCancel();
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

        var countriesDropDown = '';
        if (countryItems.length) {
            countriesDropDown = (
                <DropDownMenu
                    className="s_width_half"
                    menuItems={countryItems}
                    selectedIndex={selectedCountryIndex}
                    autoWidth={false}
                    onChange={this._onCountryChange}
                    ref="country" />
            )
        }

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

                <TextField
                    defaultValue={this.props.tournament.vk}
                    placehoder="https://vk.com/amateurenglishleague"
                    floatingLabelText="URL страницы турнира в Вконтакте"
                    disabled={disabled}
                    errorText={this.state.validation.vk ? 'Поле не может быть пустым' : null}
                    ref="vk" />

                {countriesDropDown}

                <div className="s_position_relative s_overflow_hidden s_mt_24">
                    <div className="s_float_l s_width_half">
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
                                    value="IN_PROGRESS"
                                    label="IN_PROGRESS"
                                    disabled={true} />
                                <RadioButton
                                    value="ARCHIVE"
                                    label="ARCHIVE"
                                    disabled={true} />
                            </RadioButtonGroup>
                        </div>

                        <div className="s_width_quarter s_display_inline-block s_mt_24">
                            <Toggle
                                name="show"
                                value="show"
                                ref="show"
                                disabled={disabled}
                                defaultToggled={this.props.tournament.show}
                                label="Show" />
                        </div>
                    </div>


                    <div className="buttons s_float_r s_width_quarter">
                        <Button className="button_type_cancel s_mt_36" label="Cancel" secondary={true} disabled={!this.props.tournament.name} onClick={this._onCancel} />
                        <Button className="button_type_save s_float_r s_mt_36" label="Save" primary={true} disabled={!this.props.tournament.name} onClick={this._onSave} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TournamentForm;
