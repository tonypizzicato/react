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

import Dragon from '../Dragon.jsx';

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
            <Dragon key={this.props.category._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={styles.root}
                    onTouchTap={this.props.onEdit}
                    data-id={this.props.category._id}
                    leftAvatar={<Avatar>{this.props.category.name[0]}</Avatar>}
                    primaryText={this.props.category.name}
                    secondaryText={this.props.category.title}
                    rightIconButton={rightIconMenu}
                />
            </Dragon>
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
