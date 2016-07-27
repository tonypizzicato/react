import React, { Component, PropTypes } from 'react';

let _img;

class Image extends Component {

    static propTypes = {
        src:            PropTypes.string.isRequired,
        transition:     PropTypes.string,
        aspectRatio:    PropTypes.number,
        width:          PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        height:         PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        pos:            PropTypes.shape({ x: PropTypes.string, y: PropTypes.string }),
        style:          PropTypes.object,
        containerStyle: PropTypes.object
    };

    static defaultProps = {
        aspectRatio: 1,
        style:       {
            size: 'cover'
        },
        width:       400,
        pos:         { x: '50%', y: '50%' }
    };

    componentDidMount() {
        _img = document.createElement('img');

        _img.onload = function () {
        }.bind(this);

        _img.onerror = function () {
            _img.src = 'http://placehold.it/' + this.props.width + '?text=load error';
        }.bind(this);

        _img.src = this.props.src
    }

    componentWillUnmount() {
        _img.onload  = null;
        _img.onerror = null;
    }

    setImagePos(x, y) {
        if (x) {
            this.refs.image.getDOMNode().style.backgroundPositionX = x;
        }
        if (y) {
            this.refs.image.getDOMNode().style.backgroundPositionY = y;
        }
    }

    render() {
        const divStyles = {
            ...{
                position: 'relative',
                width:    this.props.width,
                height:   this.props.height,
                margin:   '0 auto 24px'
            },
            ...this.props.containerStyle
        };

        const imageStyles = {
            ...{
                position:           'absolute',
                top:                0,
                right:              0,
                bottom:             0,
                left:               0,
                borderRadius:       '6px',
                backgroundPosition: this.props.pos.x + ' ' + this.props.pos.y,
                backgroundImage:    'url(' + this.props.src + ')',
                transition:         this.props.transition || 'opacity 0.6s ease'
            },
            ...this.props.style
        };

        return (
            <div style={divStyles}>
                <div style={imageStyles} ref="image"/>
            </div>
        )
    }
}

export default Image;
