import React, { Component, PropTypes} from 'react';

import Spacing from 'material-ui/lib/styles/spacing';

import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';
import Button from 'material-ui/lib/raised-button';
import RadioButton from 'material-ui/lib/radio-button-group';
import RadioButtonGroup from 'material-ui/lib/radio-button';

import EventsConstants from '../../constants/EventsConstants';

import CountriesActions from'../../actions/CountriesActions';
import CountriesStore from'../../stores/CountriesStore';

class CountryForm extends Component {

    static defaultProps = {
        country:  {
            name:  '',
            slug:  '',
            state: 'CREATED',
            show:  false
        },
        leagueId: null
    };

    state = {
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onValidationError = this._onValidationError.bind(this);
        this._onSave            = this._onSave.bind(this);
        this._onCancel          = this._onCancel.bind(this);
    }

    componentDidMount() {
        CountriesStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillUnmount() {
        CountriesStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.country.hasOwnProperty('_id')) {
            this._clearForm();
        }
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onSave() {
        let country = {
            name:     this.refs.name.getValue(),
            slug:     this.refs.slug.getValue(),
            vk:       this.refs.vk.getValue(),
            state:    this.refs.state.getSelectedValue(),
            leagueId: this.props.leagueId,
            show:     this.refs.show.isToggled()
        };

        this.setState({validation: {}});
        if (this.props.country._id) {
            country._id = this.props.country._id;
            CountriesActions.save(country);
        } else {
            CountriesActions.add(country);
        }
    }

    _onCancel() {
        this._clearForm();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    _clearForm() {
        this.setState({validation: {}});

        this.refs.name.setValue('');
        this.refs.slug.setValue('');
        this.refs.vk.setValue('');
        this.refs.state.setSelectedValue('CREATED');
        this.refs.show.setToggled(false);
    }

    render() {
        const styles = this.getStyles();

        return (
            <div style={styles.root} key={`${this.props.country._id}-country-form`}>
                <TextField
                    style={styles.input}
                    defaultValue={this.props.country.name}
                    hintText="Введите название страны"
                    floatingLabelText="Название"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.country.slug}
                    hintText="Введите url страны (пример: en)"
                    floatingLabelText="URL"
                    errorText={this.state.validation.slug ? 'Поле не может быть пустым' : null}
                    ref="slug"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.country.vk}
                    hintText="Введите адрес страны Вконтакте"
                    floatingLabelText="VK"
                    ref="vk"/>
                <RadioButtonGroup
                    style={styles.radioGroup}
                    name="state"
                    defaultSelected={this.props.country.state ? this.props.country.state : 'CREATED'}
                    ref="state">
                    <RadioButton
                        value="CREATED"
                        label="CREATED"/>
                    <RadioButton
                        value="ACTIVE"
                        label="ACTIVE"/>
                    <RadioButton
                        value="ARCHIVE"
                        label="ARCHIVE"/>
                </RadioButtonGroup>

                <Toggle
                    style={styles.toggle}
                    labelPosition="right"
                    name="show"
                    value="show"
                    ref="show"
                    defaultToggled={this.props.country.show}
                    label="Показывать"/>
                <Button style={styles.button} label="Отменить" secondary={true} onClick={this._onCancel}/>
                <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSave}/>
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
                width: '100%',
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
            }
        }
    }
}

module.exports = CountryForm;
