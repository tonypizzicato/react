import React, { Component, PropTypes } from 'react';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import * as Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

class CategoryItem extends Component {
    static propTypes = {
        category: PropTypes.object,
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
                    data-id={this.props.category._id}
                    leftIcon={<DeleteIcon color={Colors.grey600}/>}/>
            </IconMenu>
        );

        return (
            <ListItem
                style={styles.root}
                onTouchTap={this.props.onEdit}
                data-id={this.props.category._id}
                leftAvatar={<Avatar>{this.props.category.name[0]}</Avatar>}
                primaryText={this.props.category.name}
                secondaryText={this.props.category.title}
                rightIconButton={rightIconMenu}
            />
        );
    }

    getStyles() {
        return {
            root: {
                margin: Spacing.desktopGutter + ' 0'
            }
        }
    }
}

module.exports = CategoryItem;
