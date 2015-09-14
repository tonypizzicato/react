"use strict";

var React      = require('react'),
    cx         = React.addons.classSet,
    mui        = require('material-ui'),

    Colors     = mui.Styles.Colors,
    Spacing    = mui.Styles.Spacing,

    ListItem   = mui.ListItem,
    Avatar     = mui.Avatar,

    Dragon     = require('../Dragon.jsx'),

    Paper      = mui.Paper,
    Icon       = mui.FontIcon,
    IconButton = mui.IconButton;

class LeagueItem extends React.Component {

    static propTypes = {
        league: React.PropTypes.shape({
            name: React.PropTypes.string,
            slug: React.PropTypes.string
        }).required,
        index:  React.PropTypes.number.required,
        onEdit: React.PropTypes.func.required,
        onDrop: React.PropTypes.func.required
    }

    static defaultProps = {
        league: {}
    }

    render() {
        const styles = this.getStyles();

        const editButton = <IconButton
            iconClassName="mdfi_editor_mode_edit"
            onClick={this.props.onEdit}
            data-id={this.props.league._id}/>

        return (
            <Dragon element="div" message={this.props.index} onDrop={this.props.onDrop}>
                <ListItem
                    style={styles.root}
                    onClick={this.props.onEdit}
                    data-id={this.props.league._id}
                    leftAvatar={<Avatar>{this.props.league.name[0]}</Avatar>}
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
