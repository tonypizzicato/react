import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';

const reinsert = (arr, from, to) => {
    const _arr = arr.slice(0);
    const val  = _arr[from];
    _arr.splice(from, 1);
    _arr.splice(to, 0, val);
    return _arr;
};

const clamp = (i, min, max) => {
    return Math.max(Math.min(i, max), min);
};

const springConfig = [300, 50];

class Sortable extends Component {

    static propTypes = {
        itemHeight: PropTypes.number,
        onSort:     PropTypes.func,
        delay:      PropTypes.number
    };

    static defaultProps = {
        itemHeight: 100,
        delay:      1000
    };

    state = {
        delta:       0,
        mouse:       0,
        isPressed:   false,
        lastPressed: 0,
        order:       _.range(this.props.children.length)
    };

    mouseDownTimeout;

    constructor(props) {
        super(props);

        this._onSort = _.debounce(props.onSort, props.delay);

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove  = this.handleTouchMove.bind(this);
        this.handleMouseDown  = this.handleMouseDown.bind(this);
        this.handleMouseMove  = this.handleMouseMove.bind(this);
        this.handleMouseUp    = this.handleMouseUp.bind(this);
    }

    componentWillUnmount() {
        this._onSort.cancel();
    }

    handleTouchStart(key, pressLocation, e) {
        this.handleMouseDown(key, pressLocation, e.touches[0]);
    }

    handleTouchMove(e) {
        e.preventDefault();
        this.handleMouseMove(e.touches[0]);
    }

    handleMouseDown(pos, pressY, e) {
        if (e.button !== 0) {
            return
        }

        const newState = {
            delta:       e.pageY - pressY,
            mouse:       pressY,
            isPressed:   true,
            lastPressed: pos
        };

        this.mouseDownTimeout = setTimeout(() => {
            this.setState(newState);
        }, 100);
    }

    handleMouseMove(e) {
        if (e.button !== 0) {
            return
        }

        const { isPressed, delta, order, lastPressed } = this.state;

        if (isPressed) {
            const mouse    = e.pageY - delta;
            const row      = clamp(Math.round(mouse / this.props.itemHeight), 0, this.props.children.length - 1);
            const newOrder = reinsert(order, order.indexOf(lastPressed), row);
            this.setState({ mouse: mouse, order: newOrder });
        }
    }

    handleMouseUp() {
        clearTimeout(this.mouseDownTimeout);
        this.setState({ isPressed: false, delta: 0 });

        if (this.props.onSort) {
            this._onSort(this.state.order);
        }
    }

    render() {
        const {mouse, isPressed, lastPressed, order} = this.state;

        return (
            <div style={this.getStyles().root}>
                {this.props.children.map((child, i) => {
                    let style;
                    if (lastPressed === i && isPressed) {
                        style = {

                            scale:  spring(1.021, springConfig),
                            shadow: spring(2, springConfig),
                            bg:     spring(.8, springConfig),
                            y:      mouse
                        };
                    } else {
                        style = {
                            scale:  spring(1, springConfig),
                            shadow: spring(0, springConfig),
                            bg:     spring(0, springConfig),
                            y:      spring(order.indexOf(i) * this.props.itemHeight, springConfig)
                        };
                    }

                    return (

                        <Motion style={style} key={i}>
                            {({scale, shadow, bg, y}) =>
                                <div
                                    key={i}
                                    ref={`sort-item-${i}`}
                                    onMouseDown={this.handleMouseDown.bind(null, i, y)}
                                    onTouchMove={this.handleTouchMove}
                                    onMouseMove={this.handleMouseMove}
                                    onMouseUp={this.handleMouseUp}
                                    onTouchEnd={this.handleMouseUp}
                                    onTouchStart={this.handleTouchStart.bind(null, i, y)}
                                    style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        height: this.props.itemHeight,
                                        width: '100%',
                                        background: `rgba(255,255,255,${bg})`,
                                        //WebkitFilter: lastPressed != i ? `blur(${items[lastPressed].shadow}px)` : 'none',
                                        //filter: lastPressed != i ? `blur(${items[lastPressed].shadow}px)` : 'none',
                                        boxShadow: `rgba(0, 0, 0, 0.2) 0 -${2*shadow}px ${2*shadow}px -${2*shadow}px`,
                                        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                                        WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                                        zIndex: i === lastPressed ? 99 : i
                                    }}>
                                    {this.props.children[i]}
                                </div>
                            }
                        </Motion>
                    );
                })}
            </div>
        )
    }

    getStyles() {
        return {
            root: {
                height: this.props.itemHeight * this.props.children.length
            }
        }
    }
}

export default Sortable;
