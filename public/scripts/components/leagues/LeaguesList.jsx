const React          = require('react'),
      mui            = require('material-ui'),

      Spacing        = mui.Styles.Spacing,
      Colors         = mui.Styles.Colors,

      List           = mui.List,
      ListDivider    = mui.ListDivider,

      Sortable       = require('../Sortable.jsx'),

      LeagueItem     = require('../leagues/LeagueItem.jsx'),

      LeaguesActions = require('../../actions/LeaguesActions');

class LeaguesList extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array
    };

    static defaultProps = {
        leagues: []
    };

    constructor(props) {
        super(props);

        this._onDrop = this._onDrop.bind(this);
    }

    _onDrop(from, to) {
        const items = this.props.leagues.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            LeaguesActions.save({
                _id:  item._id,
                sort: index
            });
        })
    }

    render() {
        if (!this.props.leagues.length) {
            return false;
        }

        return (
            <List style={this.getStyles().root}>
                {this.props.leagues.map((item, index) => {
                    const divider = index != this.props.leagues.length - 1 ? <ListDivider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <LeagueItem league={item} onEdit={this.props.onEdit} onDrop={this._onDrop} index={index} key={item._id}/>
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
                border:        'solid 1px ' + Colors.faintBlack,
                //position:      'relative',
                //height:        '1000px',
                //overflow:      'hidden'
            }
        }
    }
}

module.exports = LeaguesList;
