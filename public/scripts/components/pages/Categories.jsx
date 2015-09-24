const _                 = require('lodash'),
      scroll             = require('../../utils/scrollTo'),
      React             = require('react'),

      CategoriesActions = require('../../actions/CategoriesActions'),
      CategoriesStore   = require('../../stores/CategoriesStore'),

      CategoryForm      = require('../categories/CategoryForm.jsx'),
      CategoriesList    = require('../categories/CategoriesList.jsx');

class CategoriesApp extends React.Component {

    state = {
        categories:       [],
        selectedCategory: {}
    };

    constructor(props) {
        super(props);

        this._onChange = this._onChange.bind(this);
        this._onDelete = this._onDelete.bind(this);
        this._onEdit   = this._onEdit.bind(this);
        this._onCancel = this._onCancel.bind(this);
    }

    componentDidMount() {
        CategoriesStore.addChangeListener(this._onChange);
        CategoriesActions.load();
    }

    componentWillUnmount() {
        CategoriesStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            categories:       CategoriesStore.getAll(),
            selectedCategory: {}
        });
    }

    _onDelete(e) {
        CategoriesActions.delete(e.currentTarget.dataset.id);
    }

    _onEdit(e) {
        this.setState({
            selectedCategory: _.findWhere(this.state.categories, {_id: e.currentTarget.dataset.id})
        });

        _.defer(() => {
            scroll.scrollTo(0, 800, scroll.easing.easeOutQuad);
        });
    }

    _onCancel() {
        this.setState({
            selectedCategory: {}
        });
    }

    render() {
        return (
            <div>
                <CategoryForm category={this.state.selectedCategory} onCancel={this._onCancel}/>
                <CategoriesList categories={this.state.categories} onDelete={this._onDelete} onEdit={this._onEdit}/>
            </div>
        )
    }
}

module.exports = CategoriesApp;
