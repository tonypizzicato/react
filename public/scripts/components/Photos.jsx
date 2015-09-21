"use strict";

var _             = require('lodash'),
    React         = require('react'),
    mui           = require('material-ui'),
    cx            = require('classnames'),

    Button        = mui.IconButton,

    Image         = require('./Image.jsx'),
    Dragon        = require('./Dragon.jsx'),

    PhotosActions = require('../actions/PhotosActions'),
    PhotosStore   = require('../stores/PhotosStore');

var PhotosList = React.createClass({

    propTypes: function () {
        return {
            size:      React.PropTypes.number,
            photos:    React.PropTypes.array,
            type:      React.PropTypes.string.required,
            className: React.PropTypes.string,
            game:      React.PropTypes.object
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
        PhotosStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        PhotosStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState({photos: PhotosStore.getAll()});
    },

    _onDrop: function (from, to) {
        var items = this.state.photos.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        items.forEach(function (item, index) {
            if (item.sort !== index) {
                PhotosActions.save(item.type, item.postId, item._id, {sort: index, tournament: this.props.game.tournamentId},
                    {silent: true})
            }
        }.bind(this));

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
                key={item._id}/>
        }.bind(this));

        return (
            <div>{items}</div>
        );
    }
});

var PhotoItem = React.createClass({

    propTypes: function () {
        return {
            size:         React.PropTypes.number,
            image:        React.PropTypes.object.required,
            index:        React.PropTypes.number.required,
            onDrop:       React.PropTypes.string,
            className:    React.PropTypes.string,
            onDelete:     React.PropTypes.func,
            tournamentId: React.PropTypes.string
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
        });
        var image;

        if (this.props.image.thumb) {
            if (typeof this.props.image.thumb == 'string') {
                image = <Image src={this.props.image.thumb} width="150" height="150"/>;
            } else if (this.props.image.thumb.w) {
                image = <Image src={this.props.image.thumb.src} width="150" height="150"/>;
            } else {
                image = <Image width="150" height="150" alt="Ошибка загрузки"/>
            }
        } else {
            image = <Image width="150" height="150" alt="Ошибка загрузки"/>
        }

        return (
            <Dragon className={classes} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                {image}
                <Button
                    className="photos__item_delete"
                    iconClassName="mdfi_action_highlight_remove"
                    data-id={this.props.image._id}
                    data-type={this.props.image.type}
                    data-postid={this.props.image.postId}
                    onClick={this.props.onDelete}/>
            </Dragon>
        )
    }
});

module.exports = PhotosList;
