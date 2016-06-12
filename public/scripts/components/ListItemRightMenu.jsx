import React, { Component, PropTypes } from 'react';
import {
  Styles,
  IconMenu,
  IconButton
} from 'material-ui';

import MenuItem from 'material-ui/lib/menus/menu-item';
import EditIcon    from 'material-ui/lib/svg-icons/content/create';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

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