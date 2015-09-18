const React        = require('react'),
      mui          = require('material-ui'),

      Colors       = mui.Styles.Colors,
      Spacing      = mui.Styles.Spacing,

      ListItem     = mui.ListItem,
      Avatar       = mui.Avatar,
      IconMenu     = mui.IconMenu,
      IconButton   = mui.IconButton,

      MenuItem     = require('material-ui/lib/menus/menu-item'),
      MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert'),
      DeleteIcon   = require('material-ui/lib/svg-icons/action/delete'),

      Dragon       = require('../Dragon.jsx');

class CategoryItem extends React.Component {
    static propTypes = {
        category: React.PropTypes.object,
        onDelete: React.PropTypes.func.required,
        onEdit:   React.PropTypes.func.required
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
