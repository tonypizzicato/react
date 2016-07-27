import React, { Component, PropTypes } from 'react';

import Colors from 'material-ui/styles/colors';

import List from 'material-ui/List';

import NewsItem from '../news/NewsItem.jsx';

class NewsList extends Component {

    static propTypes = {
        news:     PropTypes.array.isRequired,
        onEdit:   PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired
    };

    render() {
        return (
            <List style={this.getStyles().root}>
                {this.props.news.map((item, i) => <NewsItem article={item}
                                                            onEdit={this.props.onEdit}
                                                            onDelete={this.props.onDelete}
                                                            index={i}
                                                            key={item._id}/>
                )}
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

export default NewsList;
