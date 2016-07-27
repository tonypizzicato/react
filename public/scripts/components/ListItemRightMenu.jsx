import React, { Component, PropTypes } from 'react';
import {
  Styles,
  IconMenu,
  IconButton
} from 'material-ui';

import MenuItem from 'material-ui/MenuItem';

import EditIcon    from 'material-ui/svg-icons/content/create';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class ListItemRightMenu extends Component {
  static propTypes = {
    id:      PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    style:   PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  get iconButtonMenu() {
    return (
      <IconButton touch={true}>
        <MoreVertIcon color={Styles.Colors.grey600}/>
      </IconButton>
    );
  }

  render() {
    const { id, onClick, style } = this.props;

    return (
      <IconMenu style={style} iconButtonElement={this.iconButtonMenu}>
        <MenuItem
          primaryText="Редактировать"
          onClick={() => onClick(id)}
          leftIcon={<EditIcon color={Styles.Colors.grey600}/>}/>
      </IconMenu>
    );
  }
}

export default ListItemRightMenu;