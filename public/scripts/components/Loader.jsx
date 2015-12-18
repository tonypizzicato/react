import cx from 'classnames';
import React, {Component, PropTypes} from 'react';

class Loader extends Component {
    static propTypes = {
        active: PropTypes.bool.isRequired
    };

    static defaultProps = {
        active: false
    };

    render() {
        const cls = cx('progress', {
            'progress_active_yes': this.props.active
        });

        return (
            <div className={cls}></div>
        )
    }
}

export default Loader;