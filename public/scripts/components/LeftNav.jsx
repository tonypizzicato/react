const React   = require('react');
const Router  = require('react-router');
const mui     = require('material-ui');
const LeftNav = mui.LeftNav;
const { Colors, Spacing, Typography } = mui.Styles;


class AppLeftNav extends React.Component {

    constructor() {
        super();

        this.toggle            = this.toggle.bind(this);
        this._getSelectedIndex = this._getSelectedIndex.bind(this);
        this._onLeftNavChange  = this._onLeftNavChange.bind(this);
        this._onHeaderClick    = this._onHeaderClick.bind(this);
    }

    render() {
        let header = (
            <div style={this.getStyles()} onTouchTap={this._onHeaderClick}>
                amateurs.io
            </div>
        );

        return (
            <LeftNav
                ref="leftNav"
                docked={false}
                isInitiallyOpen={false}
                header={header}
                menuItems={this.props.menuItems}
                selectedIndex={this._getSelectedIndex()}
                onChange={this._onLeftNavChange}/>
        );
    }

    toggle() {
        this.refs.leftNav.toggle();
    }

    _getSelectedIndex() {
        let currentItem;

        for (let i = this.props.menuItems.length - 1; i >= 0; i--) {
            currentItem = this.props.menuItems[i];
            if (currentItem.route && this.context.router.isActive(currentItem.route)) return i;
        }
    }

    _onLeftNavChange(e, key, payload) {
        this.context.router.transitionTo(payload.route);
    }

    _onHeaderClick() {
        this.context.router.transitionTo('root');
        this.refs.leftNav.close();
    }

    getStyles() {
        return {
            cursor:          'pointer',
            fontSize:        '24px',
            color:           Typography.textFullWhite,
            lineHeight:      Spacing.desktopKeylineIncrement + 'px',
            fontWeight:      Typography.fontWeightLight,
            backgroundColor: Colors.cyan500,
            paddingLeft:     Spacing.desktopGutter,
            paddingTop:      '0px',
            marginBottom:    '8px'
        };
    }
}

AppLeftNav.contextTypes = {
    router: React.PropTypes.func
};

module.exports = AppLeftNav;
