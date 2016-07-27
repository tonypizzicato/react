import { autobind } from 'core-decorators';
import connect from 'react-redux/lib/components/connect';
import React, { Component, PropTypes } from 'react';
import { pushState } from 'redux-router/lib/actionCreators';

import Drawer from 'material-ui/Drawer';
import List, { ListItem, MakeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {Colors, Spacing, Typography } from 'material-ui/';

const SelectableList = MakeSelectable(List);

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
    };

    state = {
        opened: this.props.opened
    };

    @autobind
    getSelectIndex() {
        return this.props.location.pathname.split('/').filter(item => item != '')[0];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.opened !== null && nextProps.opened != this.state.opened) {
            this.setState({opened: nextProps.opened});
        }
    }

    @autobind
    handleStateChange(state) {
        this.setState({opened: state});

        this.props.onStateChange && this.props.onStateChange(state);
    }

    @autobind
    handleItemClick(e, route) {
        this.props.pushState(null, route);
    }

    render() {
        const styles = this.getStyles();

        return (
            <Drawer docked={false}
                    open={this.state.opened}
                    onRequestChange={this.handleStateChange}>

                <SelectableList style={styles.root}
                                selectedItemStyle={styles.item.selected}
                                valueLink={{
                                    value: this.getSelectIndex(),
                                    requestChange: this.handleItemClick
                                }}>
                    {this.props.menuItems.map((item, i) => {
                        if (item.route) {
                            return <ListItem innerDivStyle={styles.item.root} value={item.route} primaryText={item.text} key={item.route}/>
                        } else {
                            return <Divider style={styles.divider} inset={true} key={item.type + i}/>
                        }
                    })}
                </SelectableList>

            </Drawer>
        );
    }

    getStyles() {
        return {
            root:    {
                paddingTop: Spacing.desktopKeylineIncrement + Spacing.desktopGutterLess
            },
            item:    {
                root:     {
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
        q: state.get('router').toJS().location.query.q
    }
}, {pushState})(AppLeftNav)
