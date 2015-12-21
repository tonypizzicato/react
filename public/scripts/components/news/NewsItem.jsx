import date from '../../utils/date';
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

class NewsItem extends Component {

    static propTypes = {
        index:    PropTypes.number.isRequired,
        article:  PropTypes.object.isRequired,
        onDelete: PropTypes.func.isRequired,
        onEdit:   PropTypes.func.isRequired
    };

    render() {
        const styles = this.getStyles();
        const avatar = this.props.article.title;

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
                    data-id={this.props.article._id}
                    leftIcon={<DeleteIcon color={Colors.grey600}/>}/>
            </IconMenu>
        );

        return (
            <ListItem
                style={styles.root}
                onTouchTap={() => this.props.onEdit(this.props.article._id)}
                leftAvatar={<Avatar>{avatar[0]}</Avatar>}
                primaryText={
                    <p style={styles.text.primary}>
                        {React.createElement(this.props.article.show ? IconVisibility : IconVisibilityOff, {style: styles.visibilityIcon})}
                        <span style={styles.label.primary}>{this.props.article.title}</span>
                        <span style={styles.label.secondary}>{date.format(this.props.article.dc)}</span>
                    </p>
                }
                secondaryText={this.props.article.author}
                rightIconButton={rightIconMenu}
            />
        );
    }

    getStyles() {
        return {
            root:           {
                margin: Spacing.desktopGutter + ' 0'
            },
            text:           {
                primary:   {
                    margin: 0
                },
                secondary: {
                    margin: 0,
                    height: 'auto'
                }
            },
            label:          {
                primary:   {
                    color:       Colors.darkBlack,
                    marginRight: Spacing.desktopGutterMini
                },
                secondary: {
                    color: Colors.minBlack
                },
                next:      {
                    color: Colors.lightBlack
                }
            },
            visibilityIcon: {
                position:    'relative',
                marginRight: 6,
                top:         3,
                height:      18,
                fill:        this.props.article.show ? Colors.darkBlack : Colors.lightBlack
            }
        }
    }
}

export default NewsItem;
