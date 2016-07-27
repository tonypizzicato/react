import _ from 'lodash';
import { autobind } from 'core-decorators';
import React, { Component, PropTypes } from 'react';

import List from 'material-ui/List';
import Colors from 'material-ui/styles/colors';

import Sortable from '../Sortable.jsx';

import LeagueItem from '../leagues/LeagueItem.jsx';
import LeaguesActions from '../../actions/LeaguesActions';

class LeaguesList extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array,
        onSort:  PropTypes.func,
    };

    static defaultProps = {
        leagues: [],
        onSort:  _.noop,
    };

    @autobind
    onSort(orderedItems) {
        let items = [];

        orderedItems.forEach((initial, next) => {
            items[initial] = { ...this.props.leagues[initial] };

            if (items[initial].sort != next) {
                items[initial].sort = next;
                LeaguesActions.save({
                    _id:  items[initial]._id,
                    sort: next
                }, { silent: true });
            }
        });

        this.props.onSort && this.props.onSort(items);
    }

    render() {
        const { leagues, onEdit } = this.props;

        if (!leagues.length) {
            return false;
        }

        const itemHeight = 76;

        return (
            <List style={this.styles.root}>
                <Sortable itemHeight={itemHeight} onSort={this.onSort} delay={600}>
                    {leagues.map(item => <LeagueItem league={item}
                                                     onEdit={onEdit}
                                                     key={item._id}/>
                    )}
                </Sortable>
            </List>
        );
    }

    get styles() {
        return {
            root:    {
                paddingTop:    0,
                paddingBottom: 0,
                border:        `solid 1px ${Colors.faintBlack}`,
                position:      'relative',
                overflow:      'hidden',
                userSelect:    'none',
            },
            divider: {
                marginLeft: 0
            }

        }
    }
}

export default LeaguesList;
