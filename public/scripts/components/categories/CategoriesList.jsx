import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

import Sortable from '../Sortable.jsx';
import CategoryItem from '../categories/CategoryItem.jsx';
import CategoriesActions from '../../actions/CategoriesActions';

class CategoriesList extends Component {

    static propTypes = {
        categories: PropTypes.array,
        onEdit:     PropTypes.func.isRequired,
        onDelete:   PropTypes.func.isRequired
    };

    static defaultProps = {
        categories: []
    };

    constructor(props) {
        super(props);

        this._onDrop = this._onDrop.bind(this);
    }

    _onDrop(from, to) {
        var items = this.state.categories.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach((item, index) => {
            CategoriesActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true});
        });
    }

    render() {
        if (!this.props.categories.length) {
            return false;
        }

        return (
            <List style={this.getStyles().root}>
                {this.props.categories.map((item, index) => {
                    const divider = index != this.props.categories.length - 1 ? <ListDivider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <CategoryItem
                                category={item}
                                onEdit={this.props.onEdit}
                                onDelete={this.props.onDelete}
                                onDrop={this._onDrop}
                                index={index}
                                key={item._id}/>
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

module.exports = CategoriesList;
