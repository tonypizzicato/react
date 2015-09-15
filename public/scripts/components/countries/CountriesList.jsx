"use strict";

var React            = require('react'),
    mui              = require('material-ui'),

    Spacing          = mui.Styles.Spacing,
    Colors           = mui.Styles.Colors,

    List             = mui.List,
    ListDivider      = mui.ListDivider,

    CountryItem      = require('../countries/CountryItem.jsx'),

    CountriesActions = require('../../actions/CountriesActions');

class CountriesList extends React.Component {

    static propTypes = {
        countries: React.PropTypes.array,
        leagueId:  React.PropTypes.string
    };

    static defaultProps = {
        countries: [],
        leagueId:  null
    };

    state = {
        countries: this.props.countries
    };

    constructor(props) {
        super(props);

        this._onDrop = this._onDrop.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.countries.length != nextProps.countries.length) {
            this.setState({countries: nextProps.countries});
        }
    }

    _onDrop(from, to) {
        let items = this.state.countries.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        this.setState({countries: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach((item, index) => {
            CountriesActions.save({
                _id:      item._id,
                sort:     index,
                leagueId: this.props.leagueId
            }, {silent: true});
        });
    }

    render() {
        if (!this.state.countries.length) {
            return false;
        }

        return (
            <List style={this.getStyles().root}>
                {this.state.countries.map((item, i) => {
                    const divider = i != this.props.countries.length - 1 ? <ListDivider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <CountryItem
                                country={item}
                                onEdit={this.props.onEdit}
                                onDelete={this.props.onDelete}
                                onDrop={this._onDrop}
                                index={i}
                                key={item._id}/>
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
                paddingTop: Spacing.desktopGutterLess,
                border:     'solid 1px ' + Colors.faintBlack
            }
        }
    }
}

module.exports = CountriesList;
