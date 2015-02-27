"use strict";

var React           = require('react'),
    mui             = require('material-ui'),

    Button          = mui.RaisedButton,

    MediumEditor    = require('../MediumEditor.jsx'),

    PreviewsStore   = require('../../stores/PreviewsStore'),
    PreviewsActions = require('../../actions/PreviewsActions');

var PreviewNew = React.createClass({

    propTypes: function () {
        return {
            gameId: React.PropTypes.string.required
        }
    },

    getInitialState: function () {
        return {
            preview:    {},
            validation: {}
        }
    },

    componentDidMount: function () {
        PreviewsStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        PreviewsStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        var preview = PreviewsStore.get(this.props.gameId);
        if (!preview) {
            preview = this.getInitialState().preview;
        }

        this.setState({preview: preview});
    },

    _onSave: function () {
        var preview = {
            body: this.refs.preview.getValue()
        };

        this.setState({preview: preview, validation: {}});
        PreviewsActions.add(preview);
    },

    render: function () {
        return (
            <div>
                <MediumEditor
                    hintText="Введите текст превью"
                    placehoder="Превью"
                    errorText={this.state.validation.preview ? 'Поле не может быть пустым' : null}
                    ref="preview" />

                <div className="s_float_r s_width_half">
                    <Button
                        className="button_type_save s_float_r s_mt_36"
                        label="Save"
                        primary={true}
                        onClick={this._onSave} />
                </div>
            </div>
        );
    }
});

module.exports = PreviewNew;