import _ from 'lodash';
import React, { Component, PropTypes} from 'react';

import Spacing from 'material-ui/lib/styles/spacing';

import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import Button from 'material-ui/lib/raised-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import RadioButton from 'material-ui/lib/radio-button';

import EventsConstants from '../../constants/EventsConstants';

import TournamentsActions from'../../actions/TournamentsActions';
import TournamentsStore from'../../stores/TournamentsStore';

class TournamentForm extends Component {

    static defaultProps = {
        tournament: {
            name:     '',
            slug:     '',
            state:    'CREATED',
            leagueId: null,
            country:  null
        },
        countries:  []
    };

    state = {
        country:    this.props.tournament.country,
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onSave            = this._onSave.bind(this);
        this._onCancel          = this._onCancel.bind(this);
        this._onCountryChange   = this._onCountryChange.bind(this);
        this._onValidationError = this._onValidationError.bind(this);
    }

    componentDidMount() {
        TournamentsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillUnmount() {
        TournamentsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onCountryChange(e, index, item) {
        this.setState({country: item});
    }

    _onSave() {
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
    }

    _onCancel() {
        this.setState({validation: {}});

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    render() {
        const styles = this.getStyles();

        let selectedCountryIndex = 0;
        const countryItems       = this.props.countries.map((country, index) => {
            if (this.state.country) {
                if (this.state.country._id == country._id) {
                    selectedCountryIndex = index;
                }
            } else if (this.props.tournament.country && country._id == this.props.tournament.country._id) {
                selectedCountryIndex = index;
            }

            return {text: country.name, _id: country._id, name: country.name};
        });

        let countriesDropDown = '';
        if (countryItems.length) {
            countriesDropDown = (
                <DropDownMenu
                    style={styles.dropdown.root}
                    labelStyle={styles.dropdown.label}
                    underlineStyle={styles.dropdown.underline}
                    menuItems={countryItems}
                    selectedIndex={selectedCountryIndex}
                    autoWidth={false}
                    onChange={this._onCountryChange}
                    ref="country"/>
            )
        }

        const disabled = !this.props.tournament._id;

        return (
            <div style={styles.root} key={`${this.props.tournament._id}-tournament-form`}>
                <TextField
                    style={styles.input}
                    defaultValue={this.props.tournament.name}
                    hintText="Введите название турнира"
                    floatingLabelText="Название"
                    disabled={true}
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.tournament.slug}
                    hintText="Введите url турнира (пример: bpl)"
                    placehoder="URL"
                    floatingLabelText="URL"
                    disabled={disabled}
                    errorText={this.state.validation.slug ? 'Поле не может быть пустым' : null}
                    ref="slug"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.tournament.vk}
                    placehoder="https://vk.com/amateurenglishleague"
                    floatingLabelText="URL страницы турнира в Вконтакте"
                    disabled={disabled}
                    errorText={this.state.validation.vk ? 'Поле не может быть пустым' : null}
                    ref="vk"/>

                {countriesDropDown}

                <RadioButtonGroup
                    style={styles.radioGroup}
                    name="state"
                    defaultSelected={this.props.tournament.state ? this.props.tournament.state : 'CREATED'}
                    ref="state">
                    <RadioButton
                        value="CREATED"
                        label="CREATED"
                        disabled={true}/>
                    <RadioButton
                        value="IN_PROGRESS"
                        label="IN_PROGRESS"
                        disabled={true}/>
                    <RadioButton
                        value="ARCHIVE"
                        label="ARCHIVE"
                        disabled={true}/>
                </RadioButtonGroup>

                <Toggle
                    style={styles.toggle}
                    name="show"
                    value="show"
                    ref="show"
                    labelPosition="right"
                    disabled={disabled}
                    defaultToggled={this.props.tournament.show}
                    label="Показывать"/>


                <Button style={styles.button} label="Отменить" secondary={true} disabled={!this.props.tournament.name}
                        onClick={this._onCancel}/>
                <Button style={styles.button} label="Сохранить" primary={true} disabled={!this.props.tournament.name}
                        onClick={this._onSave}/>
            </div>
        );
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

module.exports = TournamentForm;
