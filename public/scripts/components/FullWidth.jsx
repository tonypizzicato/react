var React = require('react');
var mui   = require('material-ui');

var ClearFix = mui.ClearFix;

var StylePropable  = mui.Mixins.StylePropable;
var StyleResizable = mui.Mixins.StyleResizable;
var DesktopGutter  = mui.Styles.Spacing.desktopGutter;


var FullWidth = React.createClass({

    mixins: [StylePropable, StyleResizable],

    render() {
        var {style, ...other} = this.props;

        var styles = this.getStyles();

        styles = this.mergeAndPrefix(
            styles.root,
            style,
            this.isDeviceSize(StyleResizable.statics.Sizes.SMALL) && styles.rootWhenSmall,
            this.isDeviceSize(StyleResizable.statics.Sizes.LARGE) && styles.rootWhenLarge
        );

        return (
            <ClearFix {...other} style={styles}>
                {this.props.children}
            </ClearFix>
        );
    },

    getStyles() {
        return {
            root:          {
                padding:   DesktopGutter + 'px',
                boxSizing: 'border-box'
            },
            rootWhenSmall: {
                paddingTop:    (DesktopGutter * 2) + 'px',
                paddingBottom: (DesktopGutter * 2) + 'px'
            },
            rootWhenLarge: {
                paddingTop:    (DesktopGutter * 3) + 'px',
                paddingBottom: (DesktopGutter * 3) + 'px'
            }
        };
    }
});

module.exports = FullWidth;
