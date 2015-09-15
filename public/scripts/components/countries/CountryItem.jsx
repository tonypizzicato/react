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

class CountryItem extends React.Component {

    static propTypes = {
        country:  React.PropTypes.object,
        onDelete: React.PropTypes.func.required,
        onEdit:   React.PropTypes.func.required
    };

    render() {

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
            <Dragon key={this.props.country._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={this.getStyles().root}
                    onTouchTap={this.props.onEdit}
                    data-id={this.props.country._id}
                    leftAvatar={<Avatar>{this.props.country.name[0]}</Avatar>}
                    primaryText={this.props.country.name}
                    secondaryText={
                        <p>
                            <span style={{color: Colors.darkBlack}}>{this.props.country.slug}</span><br/>
                            <span style={{color: Colors.minBlack}}>{this.props.country.state}</span><br/>
                        </p>
                      }
                    secondaryTextLines={2}
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

module.exports = CountryItem;
