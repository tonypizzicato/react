import cx from 'classnames';
import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import Icon from 'material-ui/lib/font-icon';

import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import EditIcon from 'material-ui/lib/svg-icons/content/create';

class FieldItem extends Component {

    static propTypes = {
        field:    PropTypes.object,
        onDelete: PropTypes.func,
        onEdit:   PropTypes.func
    }

    render() {
        const styles = this.getStyles();

        const visibilityClass = cx({
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.field.show
        });

        const avatar = this.props.field.image && this.props.field.image.thumb ?
            <Avatar size={Spacing.desktopGutter * 2} src={this.props.field.image.thumb.src}/> :
            <Avatar size={Spacing.desktopGutter * 2}>{this.props.field.title ? this.props.field.title[0] : '-'}</Avatar>;

        const iconButtonMenu = (
            <IconButton touch={true}>
                <MoreVertIcon color={Colors.grey600}/>
            </IconButton>
        );

        const rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonMenu}>
                <MenuItem
                    primaryText="Редактировать"
                    onClick={this.props.onEdit}
                    data-id={this.props.field._id}
                    leftIcon={<EditIcon color={Colors.grey600}/>}/>
            </IconMenu>
        );
        return (
            <ListItem
                style={styles.root}
                data-id={this.props.field._id}
                leftAvatar={avatar}
                disabled={true}
                primaryText={
                        <p>
                            <Icon style={styles.visibilityIcon} className={visibilityClass} />
                            <span>{this.props.field.title}</span>
                        </p>
                    }
                secondaryText={this.props.field.address}
                rightIconButton={rightIconMenu}
            />
        );
    }

    getStyles() {
        return {
            root: {
                boxSizing:  'border-box',
                margin:     Spacing.desktopGutter + ' 0',
                userSelect: 'none',
                height:     '100%'
                //boxShadow:  'rgba(0, 0, 0, 0.2) 0px 1px 2px 0px'
            },

            visibilityIcon: {
                marginRight: 6,
                top:         2,
                fontSize:    18,
                color:       this.props.field.show ? Colors.blueGrey900 : Colors.lightBlack
            }
        }
    }
}

module.exports = FieldItem;
