import _ from 'lodash';
import scrollTop from '../../utils/scrollTop';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Snackbar from 'material-ui/lib/snackbar';

import CategoryForm from '../categories/CategoryForm.jsx';
import CategoriesList from '../categories/CategoriesList.jsx';

import CategoriesActions from '../../actions/CategoriesActions';

class CategoriesApp extends React.Component {

    static propTypes = {
        categories: PropTypes.object.isRequired
    };

    state = {
        selectedCategory: {},
        addMode:          true
    };

    constructor(props) {
        super(props);

        this._onDelete = this._onDelete.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onEdit   = this._onEdit.bind(this);
        this._onCancel = this._onCancel.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(CategoriesActions.fetch());
    }

    _onDelete(e) {
        const id = e.currentTarget.dataset.id;

        this.props.dispatch(CategoriesActions.remove(id))
            .then(() => this.props.dispatch(CategoriesActions.fetch()));
    }

    _onEdit(e) {
        const id = e.currentTarget.dataset.id;

        this.setState({
            selectedCategory: _.findWhere(this.props.categories.items, {_id: id}),
            addMode:          false
        });

        scrollTop();
    }

    _onSubmit(country) {
        const actionName = this.state.addMode ? 'add' : 'save';

        this.props.dispatch(CategoriesActions[actionName](country))
            .then(() => this.props.dispatch(CategoriesActions.fetch()))
            .then(this._onCancel);
    }

    _onCancel() {
        this.setState({
            selectedCategory: {},
            addMode:          true
        });
    }

    render() {
        const category = this.state.selectedCategory;
        const key      = `${category._id ? category._id : _.uniqueId()}-form`;

        return (
            <div>
                <CategoryForm
                    category={this.state.selectedCategory}
                    onSubmit={this._onSubmit}
                    onCancel={this._onCancel}
                    key={key}/>

                <CategoriesList
                    categories={this.props.categories.items}
                    onDelete={this._onDelete}
                    onEdit={this._onEdit}/>
            </div>
        )
    }
}

const mapState = state => {
    return {
        categories: state.get('categories').toJS()
    }
};

export default connect(mapState)(CategoriesApp);
