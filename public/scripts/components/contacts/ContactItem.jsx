import cx from 'classnames';
import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import Icon from 'material-ui/lib/font-icon';

import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';

import Dragon from '../Dragon.jsx';

class ContactItem extends Component {
    static propTypes() {
        return {
            contact:  PropTypes.object,
            onDelete: PropTypes.func.isRequired,
            onEdit:   PropTypes.func.isRequired
        }
    }

    render() {
        const styles = this.getStyles();

        const visibilityClass = cx({
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.contact.show
        });

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
            <Dragon key={this.props.contact._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={styles.root}
                    onTouchTap={this.props.onEdit}
                    data-id={this.props.contact._id}
                    leftAvatar={avatar}
                    primaryText={
                        <p>
                            <Icon style={styles.visibilityIcon} className={visibilityClass} />
                            <span>{this.props.contact.name}</span>
                        </p>
                    }
                    secondaryText={this.props.contact.title}
                    rightIconButton={rightIconMenu}
                />
            </Dragon>
        );
    }

    getStyles() {
        return {
            root:           {
                margin: Spacing.desktopGutter + ' 0'
            },
            visibilityIcon: {
                marginRight: 6,
                top:         2,
                fontSize:    18,
                color:       this.props.contact.show ? Colors.blueGrey900 : Colors.lightBlack
            }
        }
    }
}

module.exports = ContactItem;
