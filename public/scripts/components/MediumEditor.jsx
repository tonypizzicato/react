"use strict";

var React        = require('react'),
    mui          = require('material-ui'),
    MediumEditor = require('medium-editor'),

    Classable    = mui.Mixins.Classable,
    Dom          = mui.Utils.Dom;


var Editor = React.createClass({

    mixins: [Classable],

    getInitialState: function () {
        return {
            activated: false,
            value:     this.props.value
        };
    },

    getDefaultProps: function () {
        return {
            id:                undefined,
            value:             '',
            floatingLabelText: 'Text to edit',
            hintText:          'Enter text to edit'
        };
    },

    getValue: function () {
        return this.isMounted() ? this._editor.serialize() : undefined;
    },

    setValue: function (value) {
        this.setState({value: value});
    },

    _handleBlur: function (e) {
        var activated = e.type == 'focus';

        this.setState({activated: activated});
    },

    _handleChange: function () {
        console.log('change');
        this.setState({value: this._editor.serialize()});
    },

    _initEditor: function () {
        this._editor = new MediumEditor('.editable', {
            disablePlaceholders: true,
            buttons:             ['bold', 'italic', 'quote', 'link'],
            buttonLabels:        'fontawesome',
            firstHeader:         'h1',
            secondHeader:        'h2',
            delay:               1000,
            targetBlank:         true
        });
        this._editor.on(this.refs.editor.getDOMNode(), 'input', this._handleChange);
        this._editor.on(this.refs.editor.getDOMNode(), 'focus', this._handleBlur);
        this._editor.on(this.refs.editor.getDOMNode(), 'blur', this._handleBlur);
    },

    _deinitEditor: function () {
        this._editor.off(this.refs.editor.getDOMNode(), 'input', this._handleChange);
        this._editor.off(this.refs.editor.getDOMNode(), 'click', this._handleBlur);
        this._editor.off(this.refs.editor.getDOMNode(), 'blur', this._handleBlur);
    },

    componentDidMount: function () {
        this._initEditor();
    },

    componentWillUnmount: function () {
        this._deinitEditor();
    },

    componentDidUpdate: function () {
        this._editor.deactivate();
        this._editor.options.buttons = allowedBtns; // set contents here
        this._editor.activate();
    },

    render: function () {
        var className = this.getClasses('mui-edit-field', {
            'mui-is-focused':          this.state.activated,
            'mui-has-value':           this.state.value,
            'mui-has-floating-labels': this.props.floatingLabelText
        });

        var inputId = this.props.id;

        var floatingLabelTextElement = this.props.floatingLabelText ? (
            <label className="mui-edit-field-floating-label" htmlFor={inputId}>{this.props.floatingLabelText}</label>
        ) : null;

        var hintTextElement = this.props.hintText ? (
            <div className="mui-edit-field-hint">{this.props.hintText}</div>
        ) : null;

        return (
            <div className={className} ref="content">
                {floatingLabelTextElement}
                {hintTextElement}

                <div className="editable" ref="editor">{this.props.value}</div>

                <hr className="mui-edit-field-underline" />
                <hr className="mui-edit-field-focus-underline" />
            </div>
        )
    }
});

module.exports = Editor;