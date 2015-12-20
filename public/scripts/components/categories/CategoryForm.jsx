import React, { Component, PropTypes} from 'react';

import Spacing from 'material-ui/lib/styles/spacing';

import TextField from 'material-ui/lib/text-field';
import Button from 'material-ui/lib/raised-button';

import CategoriesActions from'../../actions/CategoriesActions';

class CategoryForm extends Component {

    static propTypes = {
        category: PropTypes.object,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        category: {
            name: ''
        }
    };

    state = {
        validation: {}
    };

    constructor(props) {
        super(props);

        this._onSubmit          = this._onSubmit.bind(this);
        this._onCancel          = this._onCancel.bind(this);
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

        let category = {
            name: this.refs.name.getValue()
        };

        if (this.props.category._id) {
            Object.assign(category, {_id: this.props.category._id});
        }

        this.props.onSubmit(category);
    }

    _onCancel() {
        this.setState({validation: {}});

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    render() {
        const styles = this.getStyles();

        return (
            <div style={styles.root}>
                <TextField
                    style={styles.input}
                    defaultValue={this.props.category.name}
                    hintText="Введите имя категории"
                    floatingLabelText="Категория"
                    errorText={this.state.validation.name ? 'Поле не может быть пустым' : null}
                    ref="name"/>

                <Button style={styles.button} label="Отменить" secondary={true} onClick={this._onCancel}/>
                <Button style={styles.button} label="Сохранить" primary={true} onClick={this._onSubmit}/>
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
