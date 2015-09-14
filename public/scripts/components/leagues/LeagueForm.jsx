"use strict";

const React           = require('react'),
      mui             = require('material-ui'),

      Spacing         = mui.Styles.Spacing,
      Paper           = mui.Paper,
      TextField       = mui.TextField,
      Toggle          = mui.Toggle,
      Button          = mui.RaisedButton,

      EventsConstants = require('../../constants/EventsConstants'),

      LeaguesActions  = require('../../actions/LeaguesActions'),
      LeaguesStore    = require('../../stores/LeaguesStore');

class LeagueForm extends React.Component {

    static propTypes() {
        league: React.PropTypes.object
    }

    static defaultProps = {
        league: {
            _id:  null,
            name: '',
            slug: '',
            show: false
        }
    }

    state = {
        validation: {}
    }

    constructor(props) {
        super(props);

        this._onCancel = this._onCancel.bind(this);
        this._onSave   = this._onSave.bind(this);
    }

    componentDidMount() {
        LeaguesStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillUnmount() {
        LeaguesStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onSave() {
        const league = {
            _id:  this.props.league._id,
            name: this.refs.name.getValue(),
            slug: this.refs.slug.getValue(),
            show: this.refs.show.isToggled()
        };

        this.setState({validation: {}});
        LeaguesActions.save(league);
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
            <div>
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
                    onClick={this._onSave}/>
            </div>
        );
    }

    getStyles() {
        return {
            root:   {},
            input:  {
                width: '100%',
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
