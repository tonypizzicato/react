import React, { Component, PropTypes} from 'react';

import Spacing from 'material-ui/lib/styles/spacing';

import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';
import Button from 'material-ui/lib/raised-button';

class LeagueForm extends Component {

    static propTypes = {
        league:   PropTypes.object,
        onSubmit: PropTypes.func.isRequired
    };

    static defaultProps = {
        league: {
            _id:  null,
            name: '',
            slug: '',
            show: false
        }
    };

    state = {
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onCancel          = this._onCancel.bind(this);
        this._onSubmit            = this._onSubmit.bind(this);
        this._onValidationError = this._onValidationError.bind(this);
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onSubmit() {
        this.setState({validation: {}});

        if (!this.props.onSubmit) {
            return;
        }

        const league = {
            _id:  this.props.league._id,
            name: this.refs.name.getValue(),
            slug: this.refs.slug.getValue(),
            show: this.refs.show.isToggled()
        };

        if (this.props.league._id) {
            Object.assign(league, {_id: this.props.league._id});
        }

        this.props.onSubmit(league);
    }

    _onCancel() {
        this.setState({validation: {}});

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    render() {
        const disabled = !this.props.league._id;
        const styles   = this.getStyles();

        return (
            <div style={styles.root}>
                <TextField
                    style={styles.input}
                    defaultValue={this.props.league.name}
                    hintText="Введите название турнира"
                    floatingLabelText="Название"
                    disabled={true}
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name"/>

                <TextField
                    style={styles.input}
                    defaultValue={this.props.league.slug}
                    hintText="Введите url турнира (пример: bpl)"
                    placehoder="URL"
                    floatingLabelText="URL"
                    disabled={disabled}
                    errorText={this.state.validation.slug ? 'Поле не может быть пустым' : null}
                    ref="slug"/>

                <Toggle
                    style={styles.toggle}
                    labelPosition="right"
                    name="show"
                    value="show"
                    ref="show"
                    defaultToggled={this.props.league.show}
                    label="Показывать"/>
                <Button
                    style={styles.button}
                    label="Отменить"
                    secondary={true}
                    disabled={!this.props.league.name}
                    onClick={this._onCancel}/>
                <Button
                    style={styles.button}
                    label="Сохранить"
                    primary={true}
                    disabled={!this.props.league.name}
                    onClick={this._onSubmit}/>
            </div>
        );
    }

    getStyles() {
        return {
            root:   {
                marginBottom: Spacing.desktopGutter,
                padding:      `0 ${Spacing.desktopGutter}px`
            },
            input:  {
                width: '100%'
            },
            toggle: {
                height:       Spacing.desktopGutter,
                marginTop:    Spacing.desktopGutter,
                marginBottom: Spacing.desktopGutter,
                marginRight:  Spacing.desktopGutter
            },
            button: {
                marginRight: Spacing.desktopGutter
            }
        }
    }
}

module.exports = LeagueForm;
