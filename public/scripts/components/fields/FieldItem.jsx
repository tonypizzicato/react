import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconMenu from 'material-ui/lib/menus/icon-menu';

import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import EditIcon from 'material-ui/lib/svg-icons/content/create';
import IconVisibility from 'material-ui/lib/svg-icons/action/visibility';
import IconVisibilityOff from 'material-ui/lib/svg-icons/action/visibility-off';

class FieldItem extends Component {

    static propTypes = {
        field:    PropTypes.object,
        onEdit:   PropTypes.func.isRequired
    }

    render() {
        const styles = this.getStyles();

        const avatar = this.props.field.image ?
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
                    <p style={styles.text}>
                        {React.createElement(this.props.field.show ? IconVisibility : IconVisibilityOff, {style: styles.visibilityIcon})}
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
            root:           {
                boxSizing:  'border-box',
                margin:     Spacing.desktopGutter + ' 0',
                userSelect: 'none',
                height:     '100%'
            },
            text:           {
                margin: 0
            },
            visibilityIcon: {
                position:    'relative',
                marginRight: 6,
                top:         3,
                height:      18,
                fill:        this.props.field.show ? Colors.darkBlack : Colors.lightBlack
            }
        }
    }
}

module.exports = FieldItem;
