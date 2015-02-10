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
            activated: false
        };
    },

    getDefaultProps: function () {
        return {
            placeholder: ''
        };
    },

    handleBlur: function () {
        this.setState({activated: !this.state.activated});
    },

    componentDidMount: function () {
        this._editor = new MediumEditor('.editable', {
            anchorInputPlaceholder: 'Type a link',
            buttons:                ['bold', 'italic', 'quote', 'link'],
            buttonLabels:           'fontawesome',
            firstHeader:            'h1',
            secondHeader:           'h2',
            delay:                  1000,
            targetBlank:            true
        });

        this._editor.on(this.refs.content.getDOMNode(), 'click', this.handleBlur);
        this._editor.on(this.refs.content.getDOMNode(), 'blur', this.handleBlur);
    },

    componentWillUnmount: function() {
        this._editor.off(this.refs.content.getDOMNode(), 'click', this.handleBlur);
        this._editor.off(this.refs.content.getDOMNode(), 'blur', this.handleBlur);
    },

    render: function () {
        var className = this.getClasses('mui-edit-field', {
            'mui-is-focused': this.state.activated
        });

        return (
            <div className={className} ref="content">
                <div className="editable">{this.props.placeholder}</div>

                <hr className="mui-edit-field-underline" />
                <hr className="mui-edit-field-focus-underline" />
            </div>
        )
    }
});

module.exports = Editor;