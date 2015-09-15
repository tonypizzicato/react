const React    = require('react'),
      mui      = require('material-ui'),

      Colors   = mui.Styles.Colors,
      Spacing  = mui.Styles.Spacing,

      Dragon   = require('../Dragon.jsx'),

      ListItem = mui.ListItem,
      Avatar   = mui.Avatar;

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

        return (
            <Dragon element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={styles.root}
                    onTouchTap={this.props.onEdit}
                    data-id={this.props.tournament._id}
                    leftAvatar={<Avatar>{avatar[0]}</Avatar>}
                    primaryText={
                        <p>
                            <span style={styles.label.name}>{this.props.tournament.name}</span>
                            <span style={{color: Colors.minBlack}}>{this.props.tournament.slug}</span>
                        </p>
                    }
                    secondaryText={
                        <p>
                            <span style={{color: Colors.darkBlack}}>{this.props.tournament.country ? this.props.tournament.country.name : ''}</span><br/>
                            <span style={{color: Colors.minBlack}}>{this.props.tournament.state}</span>
                        </p>
                    }
                    secondaryTextLines={2}
                    />
            </Dragon>
        );
    }

    getStyles() {
        return {
            root:  {
                margin: Spacing.desktopGutter + ' 0'
            },
            label: {
                name: {
                    marginRight: Spacing.desktopGutterLess
                }
            }
        }
    }
}

module.exports = TournamentItem;
