const React         = require('react'),
      mui           = require('material-ui'),

      Spacing       = mui.Styles.Spacing,
      Colors        = mui.Styles.Colors,

      List          = mui.List,
      ListDivider   = mui.ListDivider,
      SortIcon      = require('material-ui/lib/svg-icons/content/sort'),

      Sortable      = require('../Sortable.jsx'),

      FieldItem     = require('./FieldItem.jsx'),

      FieldsActions = require('../../actions/FieldsActions');

class FieldsList extends React.Component {

    static propTypes = {
        fields:   React.PropTypes.array,
        onEdit:   React.PropTypes.func.required,
        onDelete: React.PropTypes.func.required
    };

    static defaultProps = {
        fields: []
    };

    state = {
        fields: this.props.fields
    };

    constructor(props) {
        super(props);

        this._onSort = this._onSort.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({fields: nextProps.fields});
    }

    _onSort(orderedItems) {
        let items = [];

        orderedItems.forEach((prev, next) => {
            items[next] = this.state.fields[prev];

            if (next != prev) {
                FieldsActions.save({
                    _id:  items[next]._id,
                    sort: next
                }, {silent: true});
            }
        });

        this.props.onDrop && this.props.onDrop(items);

        this.setState({fields: items});
    }

    render() {
        if (!this.props.fields.length) {
            return false;
        }

        const styles     = this.getStyles();
        const itemHeight = 76;

        return (
            <List style={styles.root}>
                <Sortable itemHeight={itemHeight} onSort={this._onSort}>
                    {this.props.fields.map((item, i) => {
                        const divider = i != this.props.fields.length - 1 ? <ListDivider inset={true} style={styles.divider}/> : undefined;

                        return (
                            <div style={{height: '100%'}} key={item._id}>
                                <FieldItem
                                    field={item}
                                    onEdit={this.props.onEdit}
                                    onDelete={this.props.onDelete}
                                    onDrop={this._onSort}
                                    index={i}/>
                                {divider}
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
