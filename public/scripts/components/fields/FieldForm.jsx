import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

import TransitionGroup from 'react-addons-css-transition-group';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';
import Button from 'material-ui/lib/raised-button';
import Checkbox from 'material-ui/lib/checkbox';

import MediumEditor from '../MediumEditor.jsx';
import ImageUpload from '../ImageUpload.jsx';


class FieldForm extends Component {

    static propTypes = {
        leagueId:    PropTypes.string.isRequired,
        onCancel:    PropTypes.func.isRequired,
        onSubmit:    PropTypes.func.isRequired,
        tournaments: PropTypes.array.isRequired,
        field:       PropTypes.object.isRequired
    };

    state = {
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onSubmit = this._onSubmit.bind(this);
        this._onCancel = this._onCancel.bind(this);
    }

    componentDidUpdate() {
        if (!!this.props.field.tournaments) {
            this.props.field.tournaments.forEach(item => {
                !!this.refs[`checkbox-${item._id}`] && this.refs[`checkbox-${item._id}`].setChecked(true);
            });
        }
    }

    _onSubmit() {
        this.setState({ validation: {} });

        const tournaments = this.props.tournaments
            .filter(item => this.refs[`checkbox-${item._id}`])
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

        if (this.props.field._id) {
            Object.assign(field, { _id: this.props.field._id });
        }

        this.props.onSubmit(field);
    }

    _onCancel() {
        this.setState({ validation: {} });

        this.props.onCancel();
    }

    render() {
        let content;

        if (this.props.leagueId && this.props.tournaments.length) {
            const styles = this.getStyles();

            const tournaments = _.groupBy(this.props.tournaments, item => item.country ? item.country.name : 'Остальные');

            const tournamentsBlock = (
                <div>{
                    _.values(_.mapValues(tournaments, (tournaments, country) => {
                        const tournamentsEl = tournaments.map(item => {
                            if (!item.show) return;

                            const checked = !!_.findWhere(this.props.field.tournaments, { _id: item._id });

                            return <Checkbox
                                label={item.name}
                                defaultChecked={checked}
                                ref={`checkbox-${item._id}`}
                                key={`checkbox-${item._id}`}/>
                        });

                        return (
                            <div className="s_display_inline-block s_mr_24 s_mb_24" key={country}>
                                <h5>{country}</h5>
                                {tournamentsEl}
                            </div>);

                    }))}
                </div>
            )

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
                        pos={{ x: '50%', y: '50%' }}
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
                    <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSubmit}/>
                </div>
        }

        return (
            <TransitionGroup transitionName="form" component="div"
                             transitionAppear={true}
                             transitionEnter={false}
                             transitionLeave={false}
                             transitionAppearTimeout={500}>
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
