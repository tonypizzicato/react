import React, { Component, PropTypes } from 'react';


import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconVisibility from 'material-ui/svg-icons/action/visibility';
import IconVisibilityOff from 'material-ui/svg-icons/action/visibility-off';

class CountryItem extends Component {

    static propTypes = {
        country:  PropTypes.object,
        onDelete: PropTypes.func.isRequired,
        onEdit:   PropTypes.func.isRequired
    };

    render() {
        const styles = this.getStyles();

        const iconButtonMenu = (
            <IconButton touch={true}>
                <MoreVertIcon color={Colors.grey600}/>
            </IconButton>
        );

        const rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonMenu}>
                <MenuItem
                    primaryText="Удалить"
                    onClick={this.props.onDelete}
                    data-id={this.props.country._id}
                    leftIcon={<DeleteIcon color={Colors.grey600}/>}/>
            </IconMenu>
        );

        return (
            <ListItem
                onTouchTap={this.props.onEdit}
                data-id={this.props.country._id}
                leftAvatar={<Avatar>{this.props.country.name[0]}</Avatar>}
                primaryText={
                    <p style={styles.text}>
                        {React.createElement(this.props.country.show ? IconVisibility : IconVisibilityOff, { style: styles.visibilityIcon })}
                        <span style={styles.label.primary}>{this.props.country.name}</span>
                        <span style={styles.label.secondary}>{this.props.country.slug}</span>
                    </p>
                }
                secondaryText={this.props.country.state}
                rightIconButton={rightIconMenu}
            />
        );
    }

    getStyles() {
        return {
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
                fill:        this.props.country.show ? Colors.darkBlack : Colors.lightBlack
            }
        }
    }
}

export default CountryItem;
