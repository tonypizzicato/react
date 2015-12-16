import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

import Sortable from '../Sortable.jsx';

import NewsItem from '../news/NewsItem.jsx';
import NewsActions from '../../actions/NewsActions';

class NewsList extends Component {

    static propTypes = {
        news:   PropTypes.array,
        onEdit: PropTypes.func.isRequired
    };

    static defaultProps = {
        news: []
    };

    state = {
        news: this.props.news
    };

    componentWillReceiveProps(nextProps) {
        if (this.state.news.length != nextProps.news.length) {
            this.setState({news: nextProps.news});
        }
    }

    _onDrop(from, to) {
        let items = this.state.news.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        this.setState({news: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach((item, index) => {
            NewsActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true});
        })
    }

    render() {
        if (!this.props.news.length) {
            return false;
        }

        return (
            <List style={this.getStyles().root}>
                {this.props.news.map((item, i) => {
                    const divider = i != this.props.news.length - 1 ? <Divider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <NewsItem article={item} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onDrop={this._onDrop}
                                      index={i} key={item._id}/>
                            {divider}
                        </div>
                    );
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

module.exports = NewsList;
