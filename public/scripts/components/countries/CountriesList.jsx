import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

import CountryItem from '../countries/CountryItem.jsx';
import CountriesActions from '../../actions/CountriesActions';

class CountriesList extends Component {

    static propTypes = {
        countries: PropTypes.array,
        leagueId:  PropTypes.string
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
                    const divider = i != this.props.countries.length - 1 ? <Divider inset={true}/> : undefined;

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
                paddingTop:    0,
                paddingBottom: 0,
                border:        'solid 1px ' + Colors.faintBlack
            }
        }
    }
}

module.exports = CountriesList;
