const React             = require('react'),
      mui               = require('material-ui'),

      Spacing           = mui.Styles.Spacing,
      Colors            = mui.Styles.Colors,

      List              = mui.List,
      ListDivider       = mui.ListDivider,

      Sortable          = require('../Sortable.jsx'),

      CategoryItem      = require('../categories/CategoryItem.jsx'),

      CategoriesActions = require('../../actions/CategoriesActions');

class CategoriesList extends React.Component {

    static propTypes = {
        categories: React.PropTypes.array,
        onEdit:     React.PropTypes.func.required,
        onDelete:   React.PropTypes.func.required
    };

    static defaultProps = {
        categories: []
    };

    constructor(props) {
        super(props);

        this._onDrop = this._onDrop.bind(this);
    }

    _onDrop(from, to) {
        var items = this.state.categories.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }

        items.forEach((item, index) => {
            CategoriesActions.save({
                _id:  item._id,
                sort: index
            }, {silent: true});
        });
    }

    render() {
        if (!this.props.categories.length) {
            return false;
        }

        return (
            <List style={this.getStyles().root}>
                <Sortable>
                    {this.props.categories.map((item, index) => {
                        const divider = index != this.props.categories.length - 1 ? <ListDivider inset={true}/> : undefined;

                        return (
                            <div key={item._id}>
                                <CategoryItem
                                    category={item}
                                    onEdit={this.props.onEdit}
                                    onDelete={this.props.onDelete}
                                    onDrop={this._onDrop}
                                    index={index}
                                    key={item._id}/>
                                {divider}
                            </div>
                        )
                    })}
                </Sortable>
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

module.exports = CategoriesList;
