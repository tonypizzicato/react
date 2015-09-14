"use strict";

var _            = require('lodash'),
    React        = require('react'),
    cx           = React.addons.classSet,
    mui          = require('material-ui'),
    Classable    = mui.Mixins.Classable,

    Button       = mui.FlatButton,
    Icon         = mui.FontIcon,
    ActionButton = mui.FloatingActionButton,

    Image        = require('./Image.jsx');

var ImageUpload = React.createClass({

    mixins: [Classable],

    _reader: null,

    propTypes: function () {
        return {
            label:     React.PropTypes.string,
            image:     React.PropTypes.string,
            errorText: React.PropTypes.string,
            width:     React.PropTypes.string,
            height:    React.PropTypes.string
        }
    },

    getDefaultProps: function () {
        return {
            label:     "Выберите изображение",
            image:     null,
            errorText: null,
            width:     'auto',
            height:    'auto'
        }
    },

    getInitialState: function () {
        return {
            uploaded: !!this.props.image,
            image:    this.props.image,
            isNew:    false
        }
    },

    _onImage: function () {
        this._reader = new FileReader();
        this._reader.readAsDataURL(this.refs.upload.getDOMNode().files[0]);

        this._reader.onload = function (e) {

            this.setState({
                image:    e.target.result,
                uploaded: true,
                isNew:    true
            });
        }.bind(this);
    },

    _onClick: function () {
        _.delay(function () {
            this.refs.upload.getDOMNode().click();
        }.bind(this), 300);
    },

    getImage: function () {
        return this.state.uploaded ? (this._reader ? this._reader.result : this.state.image) : null;
    },

    isNew: function () {
        return this.state.isNew;
    },

    getFile: function () {
        return this.refs.upload.getDOMNode().files[0];
    },

    setImage: function (image) {
        this.setState({
            image:    image,
            uploaded: !!image
        })
    },

    _onDelete: function () {
        this.setState({
            image:    null,
            uploaded: false,
            isNew:    true
        });
    },

    render: function () {
        var clx = this.getClasses(this.props.className, {
            'mui-file-input-container': true,
            's_mt_36':                  true
        });

        var previewClass = cx({
            'mui-file-input-image':         true,
            'mui-file-input-image-visible': this.state.uploaded
        });
        var closeClass   = cx({
            'mui-file-input-image-close': true,
            's_display_none':             !this.state.uploaded
        });

        var error = this.props.errorText ? (<span className="mui-file-input-error">{this.props.errorText}</span>) : '';
        var image = this.state.image ?
            <Image src={this.state.image} className={previewClass} width={this.props.width} height={this.props.height} ref="preview"/> : '';

        return (
            <div className={clx}>
                {image}
                <ActionButton className={closeClass} iconClassName="mdfi_navigation_close" onClick={this._onDelete}/>
                <input className="file-input" type="file" onChange={this._onImage} ref="upload"/>

                <div className="mui-file-input">
                    <Button onClick={this._onClick}>
                        <Icon className="mdfi_image_photo s_mr_6 s_t_4"/>
                        <span className="mui-flat-button-label">{this.props.label}</span>
                    </Button>
                    {error}
                </div>
            </div>
        );
    }
});

module.exports = ImageUpload;
