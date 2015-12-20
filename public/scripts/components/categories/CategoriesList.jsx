import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

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
            <List style={this.getStyles().root}>
                {this.props.categories.map((item, index) => {
                    const divider = index != this.props.categories.length - 1 ? <Divider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <CategoryItem
                                category={item}
                                onEdit={this.props.onEdit}
                                onDelete={this.props.onDelete}
                                index={index}/>
                            {divider}
                        </div>
                    )
                })}
            </List>
        );
    }

    getStyles() {
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
