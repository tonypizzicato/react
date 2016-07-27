import React, { Component, PropTypes } from 'react';

import List from 'material-ui/List';
import * as Colors from 'material-ui/styles/colors';

import CategoryItem from '../categories/CategoryItem.jsx';

class CategoriesList extends Component {

    static propTypes = {
        categories: PropTypes.array,
        onEdit:     PropTypes.func.isRequired,
        onDelete:   PropTypes.func.isRequired
    };

    static defaultProps = {
        categories: []
    };

    render() {
        return (
            <List style={this.styles.root}>
                {this.props.categories.map((item, index) => <CategoryItem category={item}
                                                                          onEdit={this.props.onEdit}
                                                                          onDelete={this.props.onDelete}
                                                                          index={index}
                                                                          key={item._id}/>
                )}
            </List>
        );
    }

    get styles() {
        return {
            root: {
                paddingTop:    0,
                paddingBottom: 0,
                border:        'solid 1px ' + Colors.faintBlack
            }
        }
    }
}

export default CategoriesList;
