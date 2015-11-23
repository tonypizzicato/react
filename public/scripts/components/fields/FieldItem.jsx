const React        = require('react'),
      cx           = require('classnames'),
      mui          = require('material-ui'),

      Colors       = mui.Styles.Colors,
      Spacing      = mui.Styles.Spacing,

      ListItem     = mui.ListItem,
      IconMenu     = mui.IconMenu,
      IconButton   = mui.IconButton,
      Icon         = mui.FontIcon,
      Avatar       = mui.Avatar,

      MenuItem     = require('material-ui/lib/menus/menu-item'),
      MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert'),
      EditIcon     = require('material-ui/lib/svg-icons/content/create');

class FieldItem extends React.Component {

    static propTypes = {
        field:    React.PropTypes.object,
        onDelete: React.PropTypes.func,
        onEdit:   React.PropTypes.func
    }

    render() {
        const styles = this.getStyles();

        const visibilityClass = cx({
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.field.show
        });

        const avatar = this.props.field.image ?
            <Avatar size={Spacing.desktopGutter * 2} src={this.props.field.image.thumb.src}/> :
            <Avatar size={Spacing.desktopGutter * 2}>{this.props.field.title[0]}</Avatar>;

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
