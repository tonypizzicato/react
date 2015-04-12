"use strict";

var React = require('react'),
    cx    = React.addons.classSet;

var _img;

var Image = React.createClass({

    propTypes: function () {
        return {
            src:         React.PropTypes.string.required,
            transition:  React.PropTypes.string,
            aspectRatio: React.PropTypes.number,
            width:       React.PropTypes.number.required,
            height:      React.PropTypes.number.required,
            style:       React.PropTypes.shape({
                size: React.PropTypes.string
            })
        }
    },

    getDefaultProps: function () {
        return {
            aspectRatio: 1,
            style:       {
                size: 'cover'
            }
        }
    },

    getInitialState: function () {
        return {
            loaded: false
        }
    },

    componentDidMount: function () {
        _img = document.createElement('img');

        _img.onload = function () {
            if (this.isMounted()) {
                this.setState({loaded: true});
            }
        }.bind(this);

        _img.onerror = function () {
            _img.src = 'http://placehold.it/' + this.props.width + '&text=load%20error';
        }.bind(this);

        _img.src = this.props.src
    },

    componentWillUnmount: function () {
        _img.onload  = null;
        _img.onerror = null;
    },

    render: function () {
        var divStyles = {
            position: 'relative',
            width:    this.props.width,
            height:   this.props.height
        };

        var imageStyles = {
            position:           'absolute',
            top:                0,
            right:              0,
            bottom:             0,
            left:               0,
            borderRadius:       '6px',
            backgroundSize:     this.props.style.size,
            backgroundPosition: 'center center',
            backgroundImage:    'url(' + this.props.src + ')',
            opacity:            this.state.loaded ? 100 : 0,
            transition:         this.props.transition || 'opacity 0.6s ease'
        };

        var cls = cx({
                'image':             true,
                'image_loading_yes': !this.state.loaded
            }) + ' ' + this.props.className;

        return (
            <div className={cls} style={divStyles}>
                <div style={imageStyles}/>
            </div>
        )
    }
});


module.exports = Image;