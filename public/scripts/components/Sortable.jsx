import _ from 'lodash';
import React from 'react/addons';
import {Spring} from 'react-motion';

const reinsert = (arr, from, to) => {
    const _arr = arr.slice(0);
    const val  = _arr[from];
    _arr.splice(from, 1);
    _arr.splice(to, 0, val);
    return _arr;
}

const clamp = (i, min, max) => {
    return Math.max(Math.min(i, max), min);
}

const springConfig = [300, 50];

class Sortable extends React.Component {

    static propTypes = {
        itemHeight: React.PropTypes.number
    };

    static defaultProps = {
        itemHeight: 100
    };

    state = {
        delta:       0,
        mouse:       0,
        isPressed:   false,
        lastPressed: 0,
        order:       _.range(this.props.children.length)
    };

    constructor(props) {
        super(props);

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove  = this.handleTouchMove.bind(this);
        this.handleMouseDown  = this.handleMouseDown.bind(this);
        this.handleMouseMove  = this.handleMouseMove.bind(this);
        this.handleMouseUp    = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        console.log('mounted');
    }

    handleTouchStart(key, pressLocation, e) {
        console.log('handleTouchStart');
        this.handleMouseDown(key, pressLocation, e.touches[0]);
    }

    handleTouchMove(e) {
        e.preventDefault();
        console.log('handleTouchMove');
        this.handleMouseMove(e.touches[0]);
    }

    handleMouseDown(pos, pressY, e) {
        if (e.button !== 0) {
            return
        }

        console.log('handleMouseDown');
        this.setState({
            delta:       e.pageY - pressY,
            mouse:       pressY,
            isPressed:   true,
            lastPressed: pos,
        });
    }

    handleMouseMove(e) {
        if (e.button !== 0) {
            return
        }

        const {isPressed, delta, order, lastPressed} = this.state;

        if (isPressed) {
            const mouse    = e.pageY - delta;
            const row      = clamp(Math.round(mouse / 100), 0, this.props.children.length - 1);
            const newOrder = reinsert(order, order.indexOf(lastPressed), row);
            this.setState({mouse: mouse, order: newOrder});
            console.log('moved');
        }
    }

    handleMouseUp() {
        console.log('handleMouseUp');
        this.setState({isPressed: false, delta: 0});
    }

    render() {
        console.log('rendered');
        const {mouse, isPressed, lastPressed, order} = this.state;
        const endValue = this.props.children.map((child, i) => {
            if (lastPressed === i && isPressed) {
                return {
                    scale:  {val: 1.021, config: springConfig},
                    shadow: {val: 2, config: springConfig},
                    y:      {val: mouse, config: []}
                };
            }
            return {
                scale:  {val: 1, config: springConfig},
                shadow: {val: 1, config: springConfig},
                y:      {val: order.indexOf(i) * this.props.itemHeight, config: springConfig}
            };
        });

        return (
            <Spring endValue={endValue}>
                {items =>
                <div style={this.getStyles().root}>
                    {items.map(({scale, y}, i) => {
                        return (
                        <div
                            key={i}
                            ref={`sort-item-${i}`}
                            onMouseDown={this.handleMouseDown.bind(null, i, y.val)}
                            onTouchStart={this.handleTouchStart.bind(null, i, y.val)}
                            style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                width: '100%',
                                transform: `translate3d(0, ${y.val}px, 0) scale(${scale.val})`,
                                WebkitTransform: `translate3d(0, ${y.val}px, 0) scale(${scale.val})`,
                                zIndex: i === lastPressed ? 99 : i,
                            }}>
                            {this.props.children[i]}
                        </div>
                            )
                        }
                        )}
                </div>
                    }
            </Spring>
        );
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
