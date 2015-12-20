import React, { Component, PropTypes } from 'react';

import {
    Styles,
    ListItem,
    Avatar,
} from 'material-ui';

import IconVisibility from 'material-ui/lib/svg-icons/action/visibility';
import IconVisibilityOff from 'material-ui/lib/svg-icons/action/visibility-off';

const { Colors, Spacing } = Styles;

class TournamentItem extends Component {

    static propTypes = {
        tournament: PropTypes.object,
        onEdit:     PropTypes.func.isRequired
    };

    render() {
        return (
            <ListItem
                style={styles.root}
                onTouchTap={() => this.props.onEdit(this.props.tournament._id)}
                leftAvatar={<Avatar size={Spacing.desktopGutter * 2}>{avatar[0]}</Avatar>}
                primaryText={
                    <p style={styles.text}>
                        {React.createElement(this.props.tournament.show ? IconVisibility : IconVisibilityOff, { style: styles.visibilityIcon })}
                        <span style={styles.label.primary}>{this.props.tournament.name}</span>
                        <span style={styles.label.secondary}>{this.props.tournament.slug}</span>
                    </p>
                }
                secondaryText={this.props.tournament.country ? this.props.tournament.country.name : '—'}
            />
        );
    }

    getStyles() {
        return {
            root:           {
                margin: Spacing.desktopGutter + ' 0'
            },
            text:           {
                margin: 0
            },
            label:          {
                primary:   {
                    color:       Colors.darkBlack,
                    marginRight: Spacing.desktopGutterMini
                },
                secondary: {
                    color: Colors.minBlack
                }
            },
            visibilityIcon: {
                position:    'relative',
                marginRight: 6,
                top:         3,
                height:      18,
                fill:        this.props.tournament.show ? Colors.darkBlack : Colors.lightBlack
            }
        }
    }
}

export default TournamentItem;
