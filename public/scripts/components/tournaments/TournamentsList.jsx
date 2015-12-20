import { autobind } from 'core-decorators';
import React, { Component, PropTypes } from 'react';
import {
    Styles,
    List,
    ListDivider
} from 'material-ui';

import TournamentItem from '../tournaments/TournamentItem.jsx';

class TournamentsList extends Component {

    static propTypes = {
        tournaments: PropTypes.array
    };

    static defaultProps = {
        tournaments: []
    };

    @autobind
    onSort(orderedItems) {
        const items = [];

        orderedItems.forEach((initial, next) => {
            items[initial] = { ...this.state.tournaments[initial] };

            if (items[initial].sort != next) {
                items[initial].sort = next;
                // TournamentsActions.save({
                //     _id:  items[initial]._id,
                //     sort: next
                // }, { silent: true });
            }
        });

        this.props.onDrop && this.props.onDrop(items);

        this.setState({ tournaments: items });
    }

    render() {
        const itemHeight = 76;

        return (
            <List style={this.styles.root}>
                <Sortable itemHeight={itemHeight} onSort={this.onSort} delay={600}>
                    {this.props.tournaments.map((item, i) => {
                        const divider = i != this.props.tournaments.length - 1 ? <ListDivider inset={true} style={this.styles.divider}/> : undefined;

                        return (
                            <div style={{ height: '100%' }} key={item._id}>
                                <TournamentItem tournament={item} onEdit={this.props.onEdit} onDrop={this.onSort}/>
                                {divider}
                            </div>
                        );
                    })}
                </Sortable>
            </List>
        );
    }

    get styles() {
        return {
            root:    {
                paddingTop:    0,
                paddingBottom: 0,
                border:        'solid 1px ' + Styles.Colors.faintBlack,
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

module.exports = TournamentsList;
