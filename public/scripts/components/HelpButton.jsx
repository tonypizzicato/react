import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Spacing from 'material-ui/styles/spacing';
import * as Colors from 'material-ui/styles/colors';

class HelpButton extends Component {
    static propTypes = {
        dialog: PropTypes.element.isRequired
    };

    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
    }

    _onClick() {
        this.props.dialog.show();
    }

    render() {
        const styles = this.getStyles();

        return (
            <RaisedButton
                style={styles.root}
                labelStyle={styles.label}
                secondary={true}
                backgroundColor={Colors.blue500}
                onTouchTap={this._onClick}
                label="Справка"
                labelPosition="after">
                <FontIcon style={styles.icon} className="mdfi_action_help"/>
            </RaisedButton>
        );
    }

    getStyles() {
        return {
            root:  {
                width:     '100%',
                marginTop: Spacing.desktopGutter
            },
            label: {
                padding: '0 8px'
            },
            icon:  {
                verticalAlign: 'middle',
                top:           '-3px',
                fontSize:      '22px',
                color:         Colors.white
            }
        }
    }
}

module.exports = HelpButton;
