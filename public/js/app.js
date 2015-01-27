/** @jsx React.DOM */

var React = require('react');


var Link = React.createClass({

    getInitialState: function () {
        return {
            value: parseInt(this.props.value)
        }
    },

    _onClick: function (e) {
        e.preventDefault();
        this.setState({value: this.state.value + 1});
    },

    render: function () {
        return (
            <a href={this.props.url} onClick={this._onClick}>{this.props.title} & {this.state.value}</a>
        )
    }
});


var App = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Hello from React {this.props.filetype}-file</h1>
                <Link url="http://yandex.ru" title="Yandex" value="150"/>
            </div>
        )
    }
});

React.renderComponent(
    <App filetype="js"/>,
    document.getElementById('app-content')
);