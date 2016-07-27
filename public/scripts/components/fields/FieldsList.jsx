import React, { Component, PropTypes } from 'react';

import List from 'material-ui/List';
import * as Colors from 'material-ui/styles/colors';

import Sortable from '../Sortable.jsx';

import FieldItem from '../fields/FieldItem.jsx';

class FieldsList extends Component {

    static propTypes = {
        fields: PropTypes.array.isRequired,
        onEdit: PropTypes.func.isRequired,
        onSort: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this._onSort = this._onSort.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ fields: nextProps.fields });
    }

    _onSort(orderedItems) {
        let items = [];

        orderedItems.forEach((prev, next) => {
            items[next] = this.state.fields[prev];

            if (next != prev) {
                this.props.onSort({
                    _id:  items[next]._id,
                    sort: next
                });
            }
        });

        this.setState({ fields: items });
    }

    render() {
        if (!this.props.fields.length) return <div/>;

        const styles     = this.getStyles();
        const itemHeight = 76;

        return (
            <List style={styles.root}>
                <Sortable itemHeight={itemHeight} onSort={this._onSort} delay={3000}>
                    {this.props.fields.map((item, i) => {
                        return (
                            <div style={{ height: '100%' }} key={item._id}>
                                <FieldItem
                                    field={item}
                                    onEdit={this.props.onEdit}/>
                            </div>
                        );
                    })}
                </Sortable>
            </List>
        );
    }

    getStyles() {
        return {
            root:    {
                paddingTop:    0,
                paddingBottom: 0,
                border:        'solid 1px ' + Colors.faintBlack,
                position:      'relative',
                overflow:      'hidden'
            },
            divider: {
                marginLeft: 0
            }
        }
    }
}

module.exports = FieldsList;
