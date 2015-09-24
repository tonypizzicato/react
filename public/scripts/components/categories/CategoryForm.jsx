const React             = require('react'),
      mui               = require('material-ui'),

      Spacing           = mui.Styles.Spacing,

      TextField         = mui.TextField,
      Button            = mui.RaisedButton,

      EventsConstants   = require('../../constants/EventsConstants'),

      CategoriesActions = require('../../actions/CategoriesActions'),
      CategoriesStore   = require('../../stores/CategoriesStore');

class CategoryForm extends React.Component {

    static propTypes = {
        category: React.PropTypes.object,
        onCancel: React.PropTypes.func
    };

    static defaultProps = {
        category: {
            name: ''
        },
        leagueId: ''
    };

    state = {
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onSave            = this._onSave.bind(this);
        this._onCancel          = this._onCancel.bind(this);
        this._onValidationError = this._onValidationError.bind(this);
    }

    componentWillMount() {
        CategoriesStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillUnmount() {
        CategoriesStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.category.hasOwnProperty('_id') && this.refs.form) {
            this._clearForm();
        }
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onSave() {
        let category = {
            name: this.refs.name.getValue()
        };

        this.setState({validation: {}});
        if (this.props.category._id) {
            category._id = this.props.category._id;
            CategoriesActions.save(category);
        } else {
            CategoriesActions.add(category);
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
    }

    render() {
        const styles = this.getStyles();

        return (
            <div style={styles.root} key={`${this.props.category._id}-category-form`} ref="form">
                <TextField
                    style={styles.input}
                    defaultValue={this.props.category.name}
                    hintText="Введите имя категории"
                    floatingLabelText="Категория"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name"/>

                <Button style={styles.button} label="Отменить" secondary={true} onClick={this._onCancel}/>
                <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSave}/>
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
                width:        '100%',
                marginBottom: Spacing.desktopGutter
            },
            button: {
                marginRight: Spacing.desktopGutter
            }
        }
    }
}

module.exports = CategoryForm;
