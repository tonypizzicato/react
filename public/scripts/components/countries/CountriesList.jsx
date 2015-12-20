import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';

import CountryItem from '../countries/CountryItem.jsx';

class CountriesList extends Component {

    static propTypes = {
        countries: PropTypes.array
    };

    static defaultProps = {
        countries: []
    };

    render() {
        return (
            <List style={this.getStyles().root}>
                {this.props.countries.map((item, i) => {
                    const divider = i != this.props.countries.length - 1 ? <Divider inset={true}/> : undefined;

                    return (
                        <div key={item._id}>
                            <CountryItem
                                country={item}
                                onEdit={this.props.onEdit}
                                onDelete={this.props.onDelete}
                                onDrop={this._onDrop}
                                index={i}/>
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
