import React, { Component, PropTypes } from 'react';
import connect from 'react-redux/lib/components/connect';
import { pushState } from 'redux-router/lib/actionCreators';

import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import {Colors, Spacing, Typography } from 'material-ui/lib/styles/index';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

const SelectableList = SelectableContainerEnhance(List);

class AppLeftNav extends Component {

    static propTypes = {
        menuItems:     PropTypes.array.isRequired,
        opened:        PropTypes.bool,
        onStateChange: PropTypes.func,
        location:      PropTypes.object,
        history:       PropTypes.object
    };

    static defaultProps = {
        opened: false
    }

    state = {
        opened: this.props.opened
    };

    constructor(props) {
        super(props);

        this._getSelectedIndex = this._getSelectedIndex.bind(this);
        this._onItemClick      = this._onItemClick.bind(this);
        this._changeState      = this._changeState.bind(this);
    }

    _getSelectedIndex() {
        return this.props.location.pathname.split('/').filter(item => item != '')[0];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.opened !== null && nextProps.opened != this.state.opened) {
            this.setState({opened: nextProps.opened});
        }
    }

    _changeState(state) {
        console.log('left nav state changed', state);
        this.setState({opened: state});

        this.props.onStateChange && this.props.onStateChange(state);
    }

    _onItemClick(e, route) {
        this.props.pushState(null, route);

        this._changeState(false);
    }

    render() {
        const styles = this.getStyles();

        return (
            <LeftNav open={this.state.opened} docked={false} onRequestChange={this._changeState}>

                <SelectableList style={styles.root}
                                selectedItemStyle={styles.item.selected}
                                valueLink={{
                                    value: this._getSelectedIndex(),
                                    requestChange: this._onItemClick
                                }}>
                    {this.props.menuItems.map((item, i) => {
                        if (item.route) {
                            return <ListItem innerDivStyle={styles.item.root} value={item.route} primaryText={item.text} key={item.route}/>
                        } else {
                            return <Divider style={styles.divider} inset={true} key={item.type + i}/>
                        }
                    })}
                </SelectableList>

            </LeftNav>
        );
    }

    getStyles() {
        return {
            root:    {
                paddingTop: Spacing.desktopKeylineIncrement + Spacing.desktopGutterLess
            },
            item:    {
                root: {
                    fontSize:    13,
                    paddingLeft: Spacing.desktopGutter
                },
                selected: {
                    color: '#FF4081'
                }
            },
            divider: {
                marginLeft:   0,
                marginTop:    Spacing.desktopGutterMini,
                marginBottom: Spacing.desktopGutterMini
            }
        };
    }
}

export default connect(state => {
    return {
        q: state.get('router').location.query.q
    }
}, { pushState })(AppLeftNav)
