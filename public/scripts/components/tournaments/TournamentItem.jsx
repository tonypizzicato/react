const cx       = require('classnames'),
      React    = require('react'),
      mui      = require('material-ui'),

      Colors   = mui.Styles.Colors,
      Spacing  = mui.Styles.Spacing,

      Dragon   = require('../Dragon.jsx'),


      ListItem = mui.ListItem,
      Avatar   = mui.Avatar,
      Icon     = mui.FontIcon;

class TournamentItem extends React.Component {

    static propTypes = {
        tournament: React.PropTypes.shape({
            name:    React.PropTypes.string,
            slug:    React.PropTypes.string,
            country: React.PropTypes.object,
            state:   React.PropTypes.string
        }).required,
        onEdit:     React.PropTypes.func.required,
        onDrop:     React.PropTypes.func.required
    };

    static defaultProps = {
        tournament: {}
    };

    render() {
        const styles = this.getStyles();
        const avatar = this.props.tournament.name ? this.props.tournament.name : this.props.tournament.slug;

        const visibilityClass = cx({
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.tournament.show
        });

        return (
            <Dragon element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={styles.root}
                    onTouchTap={this.props.onEdit}
                    data-id={this.props.tournament._id}
                    leftAvatar={<Avatar size={Spacing.desktopGutter * 2}>{avatar[0]}</Avatar>}
                    primaryText={
                        <p>
                            <Icon style={styles.visibilityIcon} className={visibilityClass} />
                            <span style={styles.label.name}>{this.props.tournament.name}</span>
                            <span style={{color: Colors.minBlack}}>{this.props.tournament.slug}</span>
                        </p>
                    }
                    secondaryText={this.props.tournament.country ? this.props.tournament.country.name : '—'}
                    />
            </Dragon>
        );
    }

    getStyles() {
        return {
            root:           {
                margin: Spacing.desktopGutter + ' 0'
            },
            label:          {
                name: {
                    marginRight: Spacing.desktopGutterMini
                }
            },
            visibilityIcon: {
                marginRight: 6,
                top:         2,
                fontSize:    18,
                color:       this.props.tournament.show ? Colors.blueGrey900 : Colors.lightBlack
            }
        }
    }
}

module.exports = TournamentItem;
