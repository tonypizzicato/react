var cx       = require('classnames'),
    React    = require('react'),
    mui      = require('material-ui'),

    Colors   = mui.Styles.Colors,
    Spacing  = mui.Styles.Spacing,

    ListItem = mui.ListItem,
    Avatar   = mui.Avatar,
    Icon     = mui.FontIcon,

    Dragon   = require('../Dragon.jsx');

class LeagueItem extends React.Component {

    static propTypes = {
        league: React.PropTypes.shape({
            name: React.PropTypes.string,
            slug: React.PropTypes.string
        }).isRequired,
        index:  React.PropTypes.number.isRequired,
        onEdit: React.PropTypes.func.isRequired,
        onDrop: React.PropTypes.func.isRequired
    };

    static defaultProps = {
        league: {}
    };

    render() {
        const styles = this.getStyles();
        const avatar = this.props.league.slug ? this.props.league.slug : this.props.league.name;

        const visibilityClass = cx({
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.league.show
        });

        return (
            <Dragon element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={styles.root}
                    onTouchTap={this.props.onEdit}
                    data-id={this.props.league._id}
                    leftAvatar={<Avatar>{avatar[0]}</Avatar>}
                    primaryText={
                        <p>
                            <Icon style={styles.visibilityIcon} className={visibilityClass} />
                            <span>{this.props.league.name}</span>
                        </p>
                    }
                    secondaryText={this.props.league.slug}
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
                color:       this.props.league.show ? Colors.blueGrey900 : Colors.lightBlack
            }
        }
    }
}

module.exports = LeagueItem;
