var React      = require('react'),
    mui        = require('material-ui'),

    Colors     = mui.Styles.Colors,
    Spacing    = mui.Styles.Spacing,

    ListItem   = mui.ListItem,
    Avatar     = mui.Avatar,

    Dragon     = require('../Dragon.jsx');

class LeagueItem extends React.Component {

    static propTypes = {
        league: React.PropTypes.shape({
            name: React.PropTypes.string,
            slug: React.PropTypes.string
        }).required,
        index:  React.PropTypes.number.required,
        onEdit: React.PropTypes.func.required,
        onDrop: React.PropTypes.func.required
    };

    static defaultProps = {
        league: {}
    };

    render() {
        const styles = this.getStyles();
        const avatar = this.props.league.slug ? this.props.league.slug : this.props.league.name;

        return (
            <Dragon element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={styles.root}
                    disabled={true}
                    onTouchTap={this.props.onEdit}
                    data-id={this.props.league._id}
                    leftAvatar={<Avatar>{avatar[0]}</Avatar>}
                    primaryText={this.props.league.name}
                    secondaryText={this.props.league.slug}
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

module.exports = LeagueItem;
