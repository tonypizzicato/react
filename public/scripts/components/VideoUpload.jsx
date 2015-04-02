"use strict";

var _            = require('underscore'),
    React        = require('react'),
    cx           = React.addons.classSet,
    mui          = require('material-ui'),
    Classable    = mui.Mixins.Classable,

    DropDownMenu = mui.DropDownMenu,
    TextField    = mui.TextField,

    Image        = require('./Image.jsx');

var VideoUpload = React.createClass({

    mixins: [Classable],

    _reader: null,

    propTypes: function () {
        return {
            types:     React.PropTypes.array,
            type:      React.PropTypes.string,
            label:     React.PropTypes.string,
            url:       React.PropTypes.string,
            errorText: React.PropTypes.string
        }
    },

    getDefaultProps: function () {
        return {
            types: ['youtube', 'vimeo', 'vk'],
            type:  'youtube'
        }
    },

    getInitialState: function () {
        return {
            typeIndex: this.props.types.indexOf(this.props.type)
        }
    },

    getValue: function () {
        return {
            url:   this.refs.url.getValue(),
            label: this.refs.label.getValue(),
            type:  this.props.types[this.state.typeIndex]
        }
    },

    clear: function () {
        this.setState({typeIndex: this.getInitialState().typeIndex});
        this.refs.url.setValue('');
        this.refs.label.setValue('');
    },

    _onTypeChange: function (e, index) {
        this.setState({typeIndex: index});
    },

    render: function () {
        var clx = this.getClasses({
            'mui-video-input-container': true,
            'clearfix':                  true
        });

        var items = this.props.types.map(function (type) {
            return {text: type, type: type};
        }.bind(this));

        return (
            <div className={clx}>
                <div className="s_float_l s_position_relative s_mr_12" style={{
                    width: '10%'
                }}>
                    <DropDownMenu
                        menuItems={items}
                        selectedIndex={this.state.typeIndex}
                        autoWidth={false}
                        onChange={this._onTypeChange}
                        ref="type" />
                </div>
                <div className="clearfix s_position_relative" style={{
                    width:      '88%',
                    marginLeft: '12%'
                }}>
                    <TextField
                        className="mui-video-input-url"
                        defaultValue={this.props.url}
                        hintText="Введите embed ссылку"
                        ref="url" />
                    <TextField
                        className="mui-video-input-label"
                        defaultValue={this.props.label}
                        hintText="Введите название видео"
                        floatingLabelText="Заголовок"
                        ref="label" />
                </div>
            </div>
        );
    }
});

module.exports = VideoUpload;