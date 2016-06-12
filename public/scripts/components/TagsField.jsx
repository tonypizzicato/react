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
            floatingLabelText: 'Тэги',
            hintText:          'Введите тэги',
            availableTags:     [],
            splitSpaces:       true,
            splitSeparator:    ' '
        };
    },

    _onDelete: function (index) {
        this.state.tags.splice(index, 1);

        this.setState({tags: this.state.tags});
    },

    _onSave: function () {
        this._save();
    },

    _onEnter: function (event) {
        if (event.keyCode == 13) {
            return this._save();
        }
    },

    _save: function () {
        var newTag = this.refs.input.getValue();
        if (newTag.length) {
            var tags = [];
            if (this.props.splitSpaces) {
                tags = newTag.split(this.props.splitSeparator).filter(function (item) {
                    return item.length && item != this.props.splitSeparator;
                }.bind(this));
            } else {
                tags.push(newTag);
            }
            this.setState({tags: this.state.tags.concat(tags)});
            this.refs.input.setValue('');
        }
    },

    getTags: function () {
        return this.state.tags;
    },

    setTags: function (tags) {
        this.state.tags = tags;
    },

    render: function () {
        var tags = this.state.tags.map(function (tag, index) {
            return (
                <Tag onDelete={this._onDelete.bind(this, index)} value={tag} key={index} />
            );
        }.bind(this));

        return (
            <div className="tags-field">

                <TextField
                    floatingLabelText={this.props.floatingLabelText}
                    hintText={this.props.hintText}
                    onChange={this.onChange}
                    onKeyDown={this._onEnter}
                    ref="input"
                />
                <IconButton className="tags-filed-item-add" iconClassName="mdfi_action_done" onClick={this._onSave} />

                <div className="tags-filed-items">
                    {tags}
                </div>
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
                <IconButton className="tags-filed-item-delete" iconClassName="mdfi_action_highlight_remove" onClick={this.props.onDelete} />
            </span>
        );
    }
});

module.exports = TagsField;