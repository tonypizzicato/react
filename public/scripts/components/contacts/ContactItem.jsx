import cx from 'classnames';
import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';

import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import IconVisibility from 'material-ui/lib/svg-icons/action/visibility';
import IconVisibilityOff from 'material-ui/lib/svg-icons/action/visibility-off';

class ContactItem extends Component {

    static propTypes = {
        contact:  PropTypes.object,
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
                    data-id={this.props.contact._id}
                    leftIcon={<DeleteIcon color={Colors.grey600}/>}/>
            </IconMenu>
        );

        const avatar = this.props.contact.image ?
            <Avatar size={Spacing.desktopGutter * 2} src={this.props.contact.image}/> :
            <Avatar size={Spacing.desktopGutter * 2}>{this.props.contact.name[0]}</Avatar>;

        return (
            <ListItem
                onTouchTap={this.props.onEdit}
                data-id={this.props.contact._id}
                leftAvatar={avatar}
                primaryText={
                        <p style={styles.text}>
                            {React.createElement(this.props.contact.show ? IconVisibility : IconVisibilityOff, {style: styles.visibilityIcon})}
                            <span>{this.props.contact.name}</span>
                        </p>
                    }
                secondaryText={React.createElement('span', {dangerouslySetInnerHTML: {__html: this.props.contact.title}})}
                secondaryTextLines={1}
                rightIconButton={rightIconMenu}
            />
        );
    }

    getStyles() {
        return {
            text:           {
                margin: 0
            },
            visibilityIcon: {
                position:    'relative',
                marginRight: 6,
                top:         3,
                height:      18,
                fill:        this.props.contact.show ? Colors.darkBlack : Colors.lightBlack
            }
        }
    }
}

module.exports = ContactItem;
