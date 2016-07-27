import React, { Component, PropTypes } from 'react';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import * as Colors from 'material-ui/styles/colors';

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
        <MoreVertIcon color={Colors.grey600}/>
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
          leftIcon={<EditIcon color={Colors.grey600}/>}/>
      </IconMenu>
    );
  }
}

export default ListItemRightMenu;