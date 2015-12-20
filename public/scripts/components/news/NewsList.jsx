import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

import Sortable from '../Sortable.jsx';

import NewsItem from '../news/NewsItem.jsx';
import NewsActions from '../../actions/NewsActions';

import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

const SelectableList = SelectableContainerEnhance(List);

class NewsList extends Component {

    static propTypes = {
        news:   PropTypes.array.isRequired,
        onEdit: PropTypes.func.isRequired
    };

    render() {
        return (
            <SelectableList style={this.getStyles().root}>
                {this.props.news.map((item, i) => {
                    const divider = i != this.props.news.length - 1 ? <Divider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <NewsItem article={item}
                                      onEdit={this.props.onEdit}
                                      onDelete={this.props.onDelete}
                                      index={i}/>
                            {divider}
                        </div>
                    );
                })}
            </SelectableList>
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

export default NewsList;
