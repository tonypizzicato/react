const React       = require('react'),
      mui         = require('material-ui'),

      Spacing     = mui.Styles.Spacing,
      Colors      = mui.Styles.Colors,

      List        = mui.List,
      ListDivider = mui.ListDivider,

      NewsItem    = require('../news/NewsItem.jsx'),

      NewsActions = require('../../actions/NewsActions');

class NewsList extends React.Component {

    static propTypes = {
        news:   React.PropTypes.array,
        onEdit: React.PropTypes.func.isRequired
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
                    const divider = i != this.props.news.length - 1 ? <ListDivider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <NewsItem article={item} onEdit={this.props.onEdit} onDelete={this.props.onDelete} onDrop={this._onDrop} index={i} key={item._id}/>
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
