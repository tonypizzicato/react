const React    = require('react'),
      cx       = require('classnames'),
      mui      = require('material-ui'),

      Colors   = mui.Styles.Colors,
      Spacing  = mui.Styles.Spacing,

      ListItem = mui.ListItem,
      Avatar   = mui.Avatar,
      Icon     = mui.FontIcon;

class FieldItem extends React.Component {

    static propTypes = {
        field:       React.PropTypes.object,
        sortControl: React.PropTypes.node,
        onDelete:    React.PropTypes.func,
        onEdit:      React.PropTypes.func
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

        return (
            <ListItem
                style={styles.root}
                onTouchTap={this.props.onEdit}
                data-id={this.props.field._id}
                leftAvatar={avatar}
                primaryText={
                        <p>
                            <Icon style={styles.visibilityIcon} className={visibilityClass} />
                            <span>{this.props.field.title}</span>
                        </p>
                    }
                secondaryText={this.props.field.address}
                rightIconButton={this.props.sortControl ? this.props.sortControl : null}
            />
        );
    }

    getStyles() {
        return {
            root: {
                margin: Spacing.desktopGutter + ' 0'
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
