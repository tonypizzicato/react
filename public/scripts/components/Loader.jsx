import cx from 'classnames';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import CSSCore from 'fbjs/lib/CSSCore';
import { connect } from 'react-redux';

const TICK_ENTER = 3;
const TICK_LEAVE = 857;

class Loader extends Component {
    static propTypes = {
        active: PropTypes.bool.isRequired
    };

    static defaultProps = {
        active: false
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.active != nextProps.active) {
            var node = ReactDOM.findDOMNode(this);

            if (nextProps.active) {
                console.log('active');
                setTimeout(() => CSSCore.addClass(node, 'progress_active_yes'), TICK_ENTER);
            } else {
                console.log('not active');
                setTimeout(() => CSSCore.removeClass(node, 'progress_active_yes'), TICK_LEAVE);
            }

        }
    }

    render() {
        const cls = cx('progress', {
            'progress_active_yes': this.props.active
        });

        return (
            <div className={cls}></div>
        )
    }
}

function mapState(state) {
    return {
        active: !!state.get('fetchesCount')
    }
}

export default connect(mapState)(Loader);