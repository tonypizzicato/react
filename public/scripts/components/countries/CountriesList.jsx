import React, { Component, PropTypes } from 'react';

import List from 'material-ui/List';
import Colors from 'material-ui/styles/colors';

import CountryItem from '../countries/CountryItem.jsx';

class CountriesList extends Component {

    static propTypes = {
        countries: PropTypes.array.isRequired
    };

    render() {
        return (
            <List style={this.styles.root}>
                {this.props.countries.map((item, i) => <CountryItem country={item}
                                                                    onEdit={this.props.onEdit}
                                                                    onDelete={this.props.onDelete}
                                                                    key={item._id}/>
                )}
            </List>
        );
    }

    get styles() {
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
