const cx           = require('classnames'),
      React        = require('react'),
      mui          = require('material-ui'),

      Colors       = mui.Styles.Colors,
      Spacing      = mui.Styles.Spacing,

      ListItem     = mui.ListItem,
      Avatar       = mui.Avatar,
      IconMenu     = mui.IconMenu,
      IconButton   = mui.IconButton,
      Icon         = mui.FontIcon,
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
        const styles = this.getStyles();

        const visibilityClass = cx({
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.country.show
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
                    data-id={this.props.country._id}
                    leftIcon={<DeleteIcon color={Colors.grey600}/>}/>
            </IconMenu>
        );

        return (
            <Dragon key={this.props.country._id} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={styles.root}
                    onTouchTap={this.props.onEdit}
                    data-id={this.props.country._id}
                    leftAvatar={<Avatar>{this.props.country.name[0]}</Avatar>}
                    primaryText={
                        <p>
                            <Icon style={styles.visibilityIcon} className={visibilityClass} />
                            <span style={{color: Colors.darkBlack, marginRight: Spacing.desktopGutterMini}}>{this.props.country.name}</span>
                            <span style={{color: Colors.minBlack}}>{this.props.country.slug}</span>
                        </p>
                        }
                    secondaryText={this.props.country.state}
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
                color:       this.props.country.show ? Colors.blueGrey900 : Colors.lightBlack
            }
        }
    }
}

module.exports = CountryItem;
