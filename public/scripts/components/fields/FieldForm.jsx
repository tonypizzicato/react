const _                  = require('lodash'),
      React              = require('react'),
      mui                = require('material-ui'),

      Spacing            = mui.Styles.Spacing,

      TextField          = mui.TextField,
      Toggle             = mui.Toggle,
      Button             = mui.RaisedButton,
      Checkbox           = mui.Checkbox,

      MediumEditor       = require('../MediumEditor.jsx'),
      ImageUpload        = require('../ImageUpload.jsx'),

      EventsConstants    = require('../../constants/EventsConstants'),

      FieldsActions      = require('../../actions/FieldsActions'),
      FieldsStore        = require('../../stores/FieldsStore'),

      TournamentsActions = require('../../actions/TournamentsActions'),
      TournamentsStore   = require('../../stores/TournamentsStore');

const TransitionGroup = React.addons.CSSTransitionGroup;

class FieldForm extends React.Component {

    static propTypes = {
        field:    React.PropTypes.object,
        leagueId: React.PropTypes.string.isRequired
    };

    static defaultProps = {
        field:    {},
        leagueId: ''
    };

    state = {
        validation:  {},
        tournaments: []
    };

    constructor(props) {
        super(props);

        this._onSave            = this._onSave.bind(this);
        this._onCancel          = this._onCancel.bind(this);
        this._clearForm         = this._clearForm.bind(this);
        this._onTournaments     = this._onTournaments.bind(this);
        this._onValidationError = this._onValidationError.bind(this);
    }

    componentWillMount() {
        FieldsStore.addEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
        TournamentsStore.addChangeListener(this._onTournaments);

        TournamentsActions.load();
    }

    componentWillUnmount() {
        FieldsStore.removeEventListener(EventsConstants.EVENT_VALIDATION, this._onValidationError);
        TournamentsStore.removeChangeListener(this._onTournaments);
    }

    componentDidUpdate() {
        if (!!this.props.field.tournaments) {
            this.props.field.tournaments.forEach(item => {
                !!this.refs[`checkbox-${item._id}`] && this.refs[`checkbox-${item._id}`].setChecked(true);
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.field.hasOwnProperty('_id') && this.refs.form) {
            this._clearForm();
        }
    }

    _onTournaments() {
        const tournaments = TournamentsStore.getByLeague(this.props.leagueId).filter(item => !!item.country);

        this.setState({
            tournaments: tournaments
        });
    }

    _onValidationError(validation) {
        this.setState({validation: validation});
    }

    _onSave() {
        const tournaments = this.state.tournaments
            .filter(item => this.refs[`checkbox-${item._id}`].isChecked())
            .map(item => item._id);

        let field = {
            title:       this.refs.title.getValue(),
            howto:       this.refs.howto.getValue(),
            show:        this.refs.show.isToggled(),
            metro:       {
                name:  this.refs.metro_name.getValue(),
                color: this.refs.metro_color.getValue()
            },
            geo:         [
                parseFloat(this.refs.lat.getValue()),
                parseFloat(this.refs.long.getValue())
            ],
            leagueId:    this.props.leagueId,
            tournaments: tournaments
        };

        if (this.refs.image.isNew()) {
            field.image = this.refs.image.getImage();
        }

        this.setState({validation: {}});
        if (this.props.field._id) {
            field._id = this.props.field._id;
            FieldsActions.save(field);
        } else {
            FieldsActions.add(field);
        }
    }

    _onCancel() {
        this.setState({validation: {}});

        this._clearForm();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    _clearForm() {
        this.refs.howto.setValue('');
        this.refs.lat.setValue('');
        this.refs.long.setValue('');
        this.refs.metro_name.setValue('');
        this.refs.metro_color.setValue('');
        this.refs.show.setToggled(false);
        this.refs.image.setImage(null);

        this.state.tournaments.forEach(item => this.refs[`checkbox-${item._id}`].setChecked(false));
    }

    render() {
        let content;

        if (!this.props.leagueId || !this.state.tournaments.length) {
        } else {
            const styles = this.getStyles();

            const tournaments = _.groupBy(this.state.tournaments, item => item.country ? item.country.name : 'Остальные');

            const tournamentsBlock = _.mapValues(tournaments, (tournaments, country) => {
                const tournamentsEl = tournaments.map(item => {
                    const index = this.props.field.tournaments ? this.props.field.tournaments.indexOf(item._id) : -1;

                    return <Checkbox
                        label={item.name}
                        className={item.show ? '' : 'text_color_muted'}
                        defaultChecked={index !== -1}
                        ref={'checkbox-' + item._id}
                        key={'checkbox-' + item._id + '-' + item._id}/>
                });

                return (
                    <div className="s_display_inline-block s_mr_24 s_mb_24">
                        <h5>{country}</h5>
                        {tournamentsEl}
                    </div>);

            });

            let image = this.props.field.image;
            if (image && image.thumb) {
                image = image.thumb.src;
            }

            content = (
                <div style={styles.root} key={this.props.leagueId} ref="form">
                    <TextField
                        style={styles.input.full}
                        defaultValue={this.props.field.title}
                        floatingLabelText="Название"
                        disabled={true}
                        ref="title"/>

                    <TextField
                        style={styles.input.full}
                        defaultValue={this.props.field.address}
                        floatingLabelText="Адрес"
                        disabled={true}
                        ref="address"/>

                    <TextField
                        style={styles.input.half.left}
                        defaultValue={this.props.field.metro ? this.props.field.metro.name : ''}
                        floatingLabelText="Станция метро"
                        hintText="Название станции метро"
                        disabled={!this.props.field._id}
                        ref="metro_name"/>

                    <TextField
                        style={styles.input.half.right}
                        defaultValue={this.props.field.metro ? this.props.field.metro.color : ''}
                        hintText="red"
                        floatingLabelText="Цвет ветки(на английском)"
                        disabled={!this.props.field._id}
                        ref="metro_color"/>

                    <MediumEditor
                        hintText="Как добраться"
                        floatingLabelText="Информация о пути"
                        defaultValue={this.props.field.howto}
                        errorText={this.state.validation.howto ? 'Поле не может быть пустым' : null}
                        ref="howto"/>

                    <TextField
                        style={styles.input.half.left}
                        defaultValue={_.isArray(this.props.field.geo) ? this.props.field.geo[0] : ''}
                        floatingLabelText="Lat"
                        hintText="56,4554"
                        type="number"
                        disabled={!this.props.field._id}
                        errorText={this.state.validation.lat ? 'Поле не может быть пустым' : null}
                        ref="lat"/>

                    <TextField
                        style={styles.input.half.right}
                        defaultValue={_.isArray(this.props.field.geo) ? this.props.field.geo[1] : ''}
                        hintText="56,4554"
                        floatingLabelText="Long"
                        type="number"
                        disabled={!this.props.field._id}
                        errorText={this.state.validation.long ? 'Поле не может быть пустым' : null}
                        ref="long"/>

                    <div className="s_mt_24">
                        {tournamentsBlock}
                    </div>

                    <ImageUpload
                        label="Выберите изображение поля"
                        image={image}
                        width="250px"
                        height="250px"
                        pos={{x: '50%', y: '50%'}}
                        errorText={this.state.validation.image ? 'Загрузите изображение для контакта' : null}
                        key={this.props._id + '-image-upload'}
                        ref="image"/>

                    <Toggle
                        style={styles.toggle}
                        name="show"
                        value="show"
                        ref="show"
                        labelPosition="right"
                        defaultToggled={this.props.field.show}
                        label="Показывать"/>

                    <Button style={styles.button} label="Отменить" secondary={true} onClick={this._onCancel}/>
                    <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSave}/>
                </div>
            )
        }

        return (
            <TransitionGroup transitionName="form" component="div" transitionAppear={true}>
                {content}
            </TransitionGroup>
        );
    }

    getStyles() {
        return {
            root:   {
                marginBottom: Spacing.desktopGutter,
                padding:      `0 ${Spacing.desktopGutter}px`
            },
            input:  {
                full: {
                    width: '100%'
                },
                half: {
                    left:  {
                        width:       '49%',
                        marginRight: '2%'
                    },
                    right: {
                        width: '49%'
                    }
                }
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

module.exports = FieldForm;
