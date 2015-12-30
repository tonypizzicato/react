import _ from 'lodash';
import fuzzy from 'fuzzy';

import React, { Component, PropTypes } from 'react';
import AutoCompleteComponent from 'material-ui/lib/auto-complete';

class AutoComplete extends Component {
    static propTypes = {
        fullWidth:      PropTypes.bool,
        hintText:       PropTypes.string,
        suggestions:    PropTypes.array,
        primaryField:   PropTypes.string,
        secondaryField: PropTypes.func,
        style:          PropTypes.string
    };

    static defaultProps = {
        fullWidth:    true,
        hintText:     'Введите текст',
        primaryField: 'text',
        suggestions:  [],
        style:        {}
    }

    state = {
        initialSuggestions: this.props.suggestions,
        suggestions:        this.props.suggestions
    }

    _onUpdate = (token) => {
        const s = fuzzy.filter(token, this.props.suggestions.map(game => game.text), {pre: '<b>', post: '</b>'});

        const newSuggestions = [];
        let suggestion;

        s.forEach(item => {
            suggestion = this.props.suggestions[item.index];

            const string = <span dangerouslySetInnerHTML={{__html: item.string}}/>

            if (this.props.secondaryField) {
                const secondary = this.props.secondaryField(suggestion);

                suggestion.value = <AutoCompleteComponent.Item primaryText={string}
                                                               secondaryText={secondary}/>;
            } else {
                suggestion.value = string;
            }

            newSuggestions.push(suggestion);
        });

        console.log(newSuggestions);
        this.setState({suggestions: newSuggestions});
    }

    _onSelect = (item, index) => {
        console.log('request:', item, index);
    }

    render() {
        console.log(this.state.suggestions.length);

        return (
            <AutoCompleteComponent fullWidth={this.props.fullWidth}
                                   hintText={this.props.hintText}
                                   dataSource={this.state.suggestions.slice(0, 10)}
                                   animated={false}
                                   showAllItems={true}
                                   onUpdateInput={this._onUpdate}
                                   onNewRequest={this._onSelect}
                                   underlineStyle={{display: 'none'}}
                                   style={this.props.style}/>
        )
    }
}

AutoComplete.Item = AutoCompleteComponent.Item;

export default AutoComplete;