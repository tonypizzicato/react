import cx from 'classnames';
import React, { Component, PropTypes } from 'react';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';

import RightMenu from '../ListItemRightMenu.jsx';

class LeagueItem extends Component {

    static propTypes = {
        league: PropTypes.shape({
            name: PropTypes.string,
            slug: PropTypes.string
        }).isRequired,
        onEdit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        league: {}
    };

    get avatar() {
        const { league } = this.props;
        const avatar     = league.slug ? league.slug : league.name;

        return <Avatar size={Spacing.desktopGutter * 2}>{avatar[0]}</Avatar>;
    }

    get primaryText() {
        const { league } = this.props;

        const visibilityClass = cx({
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !league.show
        });

        return (
            <p>
                <Icon style={this.styles.visibilityIcon} className={visibilityClass}/>
                <span>{league.name}</span>
            </p>
        )
    }

    render() {
        const { league, onEdit } = this.props;

        return (
            <ListItem
                onTouchTap={this.props.onEdit}
                data-id={this.props.league._id}
                leftAvatar={<Avatar>{this.avatar}</Avatar>}
                primaryText={this.primaryText}
                secondaryText={this.props.league.slug}
                rightIconButton={<RightMenu id={league._id} onClick={() => onEdit(league._id)}/>}
            />
        );
    }

    get styles() {
        return {
            root:           {
                margin: `${Spacing.desktopGutter} 0`
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

export default LeagueItem;
