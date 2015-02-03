"use strict";

var React      = require('react'),
    mui        = require('material-ui'),

    TextField  = mui.TextField,
    IconButton = mui.IconButton;

var TagsField = React.createClass({

    getInitialState: function () {
        return {
            tags: this.props.tags
        }
    },

    getDefaultProps: function () {
        return {
            tags:              [],
            floatingLabelText: 'Tags',
            hintText:          'Input your tags here',
            availableTags:     []
        };
    },

    _onChange: function () {
        console.log("tags input value: " + this.refs.input.getValue());
    },

    _onDelete: function (index) {
        this.state.tags.splice(index, 1)

        this.setState({tags: this.state.tags});
    },

    _onSave: function () {
        var newTag = this.refs.input.getValue();
        console.log(newTag);
        this.state.tags.push(newTag);
        this.setState({tags: this.state.tags});
        this.refs.input.setValue('');
    },

    getTags: function () {
        return this.state.tags;
    },

    render: function () {
        var tags = this.state.tags.map(function (tag, index) {
            return (
                <Tag onDelete={this._onDelete.bind(this, index)} value={tag} />
            );
        }.bind(this));

        return (
            <div className="tags-field">
                <div className="tags-filed-items">
                    {tags}
                </div>

                <TextField
                    floatingLabelText={this.props.floatingLabelText}
                    hintText={this.props.hintText}
                    onChange={this._onChange}
                    ref="input"
                />
                <IconButton className="tags-filed-item-delete" icon="action-done" onClick={this._onSave} />

            </div>
        );
    }
});

var Tag = React.createClass({

    getDefaultProps: function () {
        return {
            value:    '',
            onDelete: null
        }
    },

    propTypes: function () {
        return {
            value:    React.PropTypes.string,
            onDelete: React.PropTypes.func
        }
    },

    getValue: function () {
        return this.props.value;
    },

    render: function () {
        return (
            <span className="tags-filed-item">
                <span className="tags-filed-item-text">{this.props.value}</span>
                <IconButton className="tags-filed-item-delete" icon="action-highlight-remove" onClick={this.props.onDelete} />
            </span>
        );
    }
})

module.exports = TagsField;