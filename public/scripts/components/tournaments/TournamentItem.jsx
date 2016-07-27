import React, { Component, PropTypes } from 'react';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import IconVisibility from 'material-ui/svg-icons/action/visibility';
import IconVisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';

class TournamentItem extends Component {

    static propTypes = {
        tournament: PropTypes.object,
        onEdit:     PropTypes.func.isRequired
    };

    get avatar() {
        const { tournament } = this.props;

        const avatar = tournament.name ? tournament.name : tournament.slug;

        return <Avatar size={Spacing.desktopGutter * 2}>{avatar[0]}</Avatar>;
    }

    get text() {
        return (
            <p style={this.styles.text}>
                {React.createElement(this.props.tournament.show ? IconVisibility : IconVisibilityOff, { style: styles.visibilityIcon })}
                <span style={this.styles.label.primary}>{this.props.tournament.name}</span>
                <span style={this.styles.label.secondary}>{this.props.tournament.slug}</span>
            </p>
        );
    }

    render() {
        return (
            <ListItem
                style={this.styles.root}
                onTouchTap={() => this.props.onEdit(this.props.tournament._id)}
                leftAvatar={this.avatar}
                primaryText={this.text}
                secondaryText={this.props.tournament.country ? this.props.tournament.country.name : '—'}
            />
        );
    }

    get styles() {
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
