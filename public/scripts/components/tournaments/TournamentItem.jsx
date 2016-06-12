import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import {
  Styles,
  ListItem,
  Avatar,
  FontIcon as Icon,
} from 'material-ui';

import RightMenu from '../ListItemRightMenu.jsx';

const { Colors, Spacing } = Styles;

class TournamentItem extends Component {

  static propTypes = {
    tournament: PropTypes.shape({
      name:    PropTypes.string,
      slug:    PropTypes.string,
      country: PropTypes.object,
      state:   PropTypes.string
    }).isRequired,
    onEdit:     PropTypes.func.isRequired,
    onDrop:     PropTypes.func.isRequired
  };

  static defaultProps = {
    tournament: {}
  };

  get avatar() {
    const { tournament } = this.props;

    const avatar = tournament.name ? tournament.name : tournament.slug;

    return <Avatar size={Spacing.desktopGutter * 2}>{avatar[0]}</Avatar>;
  }

  get primaryText() {
    const { tournament } = this.props;

    const visibilityClass = cx({
      'mdfi_action_visibility':     true,
      'mdfi_action_visibility_off': !tournament.show
    });

    return (
      <p>
        <Icon style={this.styles.visibilityIcon} className={visibilityClass}/>
        <span style={this.styles.label.name}>{tournament.name}</span>
        <span style={{color: Colors.minBlack}}>{tournament.slug}</span>
      </p>
    )
  }

  render() {
    const { tournament, onEdit } = this.props;

    return (
      <ListItem
        style={this.styles.root}
        disabled={true}
        leftAvatar={this.avatar}
        primaryText={this.primaryText}
        secondaryText={tournament.country ? tournament.country.name : '—'}
        rightIconButton={<RightMenu id={tournament._id} onClick={() => onEdit(tournament._id)} />}
      />
    );
  }

  get styles() {
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

export default TournamentItem;
