"use strict";

var React         = require('react'),
    Dragon        = require('react-dragon'),
    mui           = require('material-ui'),
    cx            = React.addons.classSet,

    Button        = mui.IconButton,

    PhotosActions = require('../actions/PhotosActions'),
    PhotosStore   = require('../stores/PhotosStore');

var PhotosList = React.createClass({

    propTypes: function () {
        return {
            size:      React.PropTypes.number,
            photos:    React.PropTypes.array,
            type:      React.PropTypes.string.required,
            className: React.PropTypes.string
        }
    },

    getDefaultProps: function () {
        return {
            size:      200,
            photos:    [],
            className: ''
        }
    },

    getInitialState: function () {
        return {
            photos: this.props.photos
        }
    },

    componentDidMount: function () {
        //PhotosStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        //PhotosStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState({photos: PhotosStore.getAll()});
    },

    _onDrop: function (from, to) {
        console.log('dropped image');
        var items = this.state.photos.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        items.forEach(function (item, index) {
            if (item.sort !== index) {
                PhotosActions.save(item.type, item.postId, item._id, {sort: index}, {silent: true})
            }
        });

        this.setState({photos: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }
    },

    _onDelete: function (e) {
        var data = e.currentTarget.dataset;
        PhotosActions.delete(data.type, data.postid, data.id);
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.state.photos.length != nextProps.photos.length) {
            this.setState({photos: nextProps.photos});
        }
    },

    render: function () {
        var items = this.state.photos.map(function (item, index) {
            return <PhotoItem
                image={item}
                index={index}
                onDrop={this._onDrop}
                onDelete={this._onDelete}
                {...this.props}
                key={item._id} />
        }.bind(this));

        return (
            <div>{items}</div>
        );
    }
});

var PhotoItem = React.createClass({

    propTypes: function () {
        return {
            size:      React.PropTypes.number,
            image:     React.PropTypes.object.required,
            index:     React.PropTypes.number.required,
            onDrop:    React.PropTypes.string,
            className: React.PropTypes.string,
            onDelete:  React.PropTypes.func
        }
    },

    getDefaultProps: function () {
        return {
            size:      200,
            className: ''
        }
    },

    render: function () {
        var classes = cx({
            'photos__item': true
        })
        return (
            <Dragon className={classes} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <img src={this.props.image.thumb} width={this.props.size} />
                <Button
                    className="photos__item_delete"
                    iconClassName="mdfi_action_highlight_remove"
                    data-id={this.props.image._id}
                    data-type={this.props.image.type}
                    data-postid={this.props.image.postId}
                    onClick={this.props.onDelete} />
            </Dragon>
        )
    }
});

module.exports = PhotosList;