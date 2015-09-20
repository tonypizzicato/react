const React             = require('react'),
      mui               = require('material-ui'),

      Tabs              = mui.Tabs,
      Tab               = mui.Tab,

      CategoriesStore   = require('../../stores/CategoriesStore'),
      CategoriesActions = require('../../actions/CategoriesActions'),

      NewsStore         = require('../../stores/NewsStore'),
      NewsActions       = require('../../actions/NewsActions'),

      CountriesStore    = require('../../stores/CountriesStore'),
      CountriesActions  = require('../../actions/CountriesActions'),

      NewsForm          = require('../news/NewsForm.jsx'),
      NewsList          = require('../news/NewsList.jsx');


class NewsApp extends React.Component {

    static propTypes = {
        leagues: React.PropTypes.array.required
    };

    state = {
        news:            [],
        categories:      [],
        countries:       [],
        selectedArticle: {}
    };

    constructor(props) {
        super(props);

        this._onCancel    = this._onCancel.bind(this);
        this._onChange    = this._onChange.bind(this);
        this._onDelete    = this._onDelete.bind(this);
        this._onEdit      = this._onEdit.bind(this);
        this._onTabChange = this._onTabChange.bind(this);
    }

    componentDidMount() {
        CategoriesStore.addChangeListener(this._onChange);
        NewsStore.addChangeListener(this._onChange);
        CountriesStore.addChangeListener(this._onChange);

        CategoriesActions.load();
        NewsActions.load();
        CountriesActions.load();
    }

    componentWillUnmount() {
        CategoriesStore.removeChangeListener(this._onChange);
        NewsStore.removeChangeListener(this._onChange);
        CountriesStore.removeChangeListener(this._onChange);
    }

    _onTabChange() {
        this.setState({
            selectedArticle: {}
        });
    }

    _onChange() {
        this.setState({
            news:            NewsStore.getAll(),
            countries:       CountriesStore.getAll(),
            categories:      CategoriesStore.getAll(),
            selectedArticle: {}
        });
    }

    _onDelete(e) {
        NewsActions.delete(e.currentTarget.dataset.id);
    }

    _onEdit(e) {
        this.setState({
            selectedArticle: this.state.news.filter(function (article) {
                return article._id == e.currentTarget.dataset.id;
            }).pop()
        });
    }

    _onCancel() {
        this.setState({
            selectedArticle: {}
        });
    }

    render() {
        var tabItems = this.props.leagues.map(league => {

            if (!this.state.countries.length) {
                return (
                    <Tab label={league.name} key={league._id}>
                        <div className="loading text_align_c s_mt_12">Loading data</div>
                    </Tab>
                );
            }

            const newsItems = this.state.news.filter(article => article.leagueId == league._id);
            const countries = this.state.countries.filter(country => country.leagueId == league._id);

            const key = league._id + '_' + (this.state.selectedArticle._id ? this.state.selectedArticle._id : 'article-new').toString();

            return (
                <Tab label={league.name} onActive={this._onTabChange} key={league._id}>
                    <NewsForm
                        className="s_mb_24"
                        article={this.state.selectedArticle}
                        leagueId={league._id}
                        categories={this.state.categories}
                        countries={countries}
                        onCancel={this._onCancel}
                        key={key}/>

                    <NewsList news={newsItems} onDelete={this._onDelete} onEdit={this._onEdit}/>
                </Tab>
            );
        });

        return (
            <Tabs>{tabItems}</Tabs>
        );
    }
}

module.exports = NewsApp;
