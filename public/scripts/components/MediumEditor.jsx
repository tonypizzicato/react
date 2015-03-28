"use strict";

var $            = require('jquery'),
    React        = require('react'),
    mui          = require('material-ui'),
    MediumEditor = require('medium-editor'),

    Classable    = mui.Mixins.Classable;


var Editor = React.createClass({

    mixins: [Classable],

    propTypes: {
        id:                React.PropTypes.string,
        defaultValue:      React.PropTypes.string,
        hintText:          React.PropTypes.string,
        errorText:         React.PropTypes.string,
        floatingLabelText: React.PropTypes.string
    },

    getInitialState: function () {
        return {
            activated: false,
            hasValue:  this.props.defaultValue.length > 0,
            errorText: this.props.errorText
        };
    },

    getDefaultProps: function () {
        return {
            id:                undefined,
            defaultValue:      '',
            floatingLabelText: 'Текст',
            hintText:          'Введите текст для редактирования'
        };
    },

    getValue: function () {
        var value = '';

        if (this.isMounted()) {
            var reg = /<(\w+)(?:\s+\w+="[^"]+(?:"\$[^"]+"[^"]+)?")*>(?:\s*|<\w+\s*\/?>)<\/\1>/gi;
            value   = this._editor.serialize()['element-0'].value;
            value   = value.replace(reg, '');
        }

        this.setValue(value);

        return value;
    },

    setValue: function (value) {
        this.setState({value: value});
        this.refs.editor.getDOMNode().innerHTML = value ? value : '';
    },

    _handleBlur: function (e) {
        var focus = e.type == 'focus';

        if (!focus && (!e.relatedTarget || e.relatedTarget.className.indexOf('medium-editor-action') === -1)) {
            this.setState({activated: false});
        } else {
            this.setState({activated: true});
        }
    },

    _handleChange: function () {
        this.setState({hasValue: this._editor.serialize()});
    },

    _initEditor: function () {
        this._editor = new MediumEditor('.editable', {
            disablePlaceholders: true,
            buttons:             ['header1', 'header2', 'bold', 'italic', 'anchor', 'quote', 'unorderedlist', 'orderedlist', 'justifyFull', 'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'image'],
            buttonLabels:        'fontawesome',
            disableDoubleReturn: true,
            firstHeader:         'h1',
            secondHeader:        'h2',
            targetBlank:         true
        });

        this.refs.editor.getDOMNode().innerHTML = this.props.defaultValue;
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

    componentWillReceiveProps: function (nextProps) {
        //if (nextProps.hasOwnProperty('errorText')) {
        //    this.setState({errorText: nextProps.errorText});
        //}
    },

    render: function () {
        var className = this.getClasses('mui-edit-field', {
            'mui-is-focused':          this.state.activated,
            'mui-has-value':           this.state.hasValue,
            'mui-has-error':           this.props.errorText,
            'mui-has-floating-labels': this.props.floatingLabelText
        });

        var inputId = this.props.id;

        var floatingLabelTextElement = this.props.floatingLabelText ? (
            <label className="mui-edit-field-floating-label" htmlFor={inputId}>{this.props.floatingLabelText}</label>
        ) : null;

        var hintTextElement = this.props.hintText ? (
            <div className="mui-edit-field-hint">{this.props.hintText}</div>
        ) : null;

        var errorTextElement = this.props.errorText ? (
            <div className="mui-edit-field-error">{this.props.errorText}</div>
        ) : null;

        return (
            <div className={className} ref="content">
                {floatingLabelTextElement}
                {hintTextElement}

                <div className="editable" ref="editor"/>

                <hr className="mui-edit-field-underline"/>
                <hr className="mui-edit-field-focus-underline"/>

                {errorTextElement}
            </div>
        )
    }
});

module.exports = Editor;