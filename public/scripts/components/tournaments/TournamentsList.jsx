const React              = require('react'),
      mui                = require('material-ui'),

      Spacing            = mui.Styles.Spacing,
      Colors             = mui.Styles.Colors,

      List               = mui.List,
      ListDivider        = mui.ListDivider,

      TournamentItem     = require('../tournaments/TournamentItem.jsx'),

      TournamentsActions = require('../../actions/TournamentsActions');

class TournamentsList extends React.Component {

    static propTypes = {
        tournaments: React.PropTypes.array
    };

    static defaultProps = {
        tournaments: []
    };


    _onDrop(from, to) {
        let items = this.props.tournaments.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach(function (item, index) {
            TournamentsActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true})
        })
    }

    render() {
        if (!this.props.tournaments.length) {
            return false;
        }

        return (
            <List style={this.getStyles().root}>
                {this.props.tournaments.map((item, i) => {
                    const divider = i != this.props.tournaments.length - 1 ? <ListDivider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <TournamentItem tournament={item} onEdit={this.props.onEdit} onDrop={this._onDrop} index={i} key={item._id}/>
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

module.exports = TournamentsList;
