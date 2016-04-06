const _             = require('lodash'),
      React         = require('react'),
      mui           = require('material-ui'),
      Colors        = mui.Styles.Colors,

      Button        = mui.IconButton,

      Image         = require('./Image.jsx'),
      Dragon        = require('./Dragon.jsx'),

      PhotosActions = require('../actions/PhotosActions'),
      PhotosStore   = require('../stores/PhotosStore');

class PhotosList extends React.Component {

    static propTypes = {
        size:      React.PropTypes.number,
        photos:    React.PropTypes.array,
        type:      React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        game:      React.PropTypes.object
    };

    static defaultProps = {
        size:      200,
        photos:    [],
        className: ''
    };

    state = {
        photos: this.props.photos
    };

    constructor(props) {
        super(props);

        this._onChange = this._onChange.bind(this);
        this._onDelete = this._onDelete.bind(this);
        this._onDrop   = this._onDrop.bind(this);
    }

    componentDidMount() {
        PhotosStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        PhotosStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({photos: PhotosStore.getAll()});
    }

    _onDrop(from, to) {
        let items = this.state.photos.slice();
        items.splice(to, 0, items.splice(from, 1)[0]);

        items.forEach((item, index) => {
            if (item.sort !== index) {
                PhotosActions.save(item.type, item.postId, item._id, {sort: index, tournament: this.props.game.tournamentId}, {silent: true})
            }
        });

        this.setState({photos: items});

        if (this.props.onDrop) {
            this.props.onDrop(items);
        }
    }

    _onDelete(e) {
        const data = e.currentTarget.dataset;
        PhotosActions.delete(data.type, data.postid, data.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.photos.length != nextProps.photos.length) {
            this.setState({photos: nextProps.photos});
        }
    }

    render() {
        return (
            <div>
                {this.state.photos.map((item, index) => {
                    return <PhotoItem
                        image={item}
                        index={index}
                        onDrop={this._onDrop}
                        onDelete={this._onDelete}
                        {...this.props}
                        key={item._id}/>
                })}
            </div>
        );
    }
}

class PhotoItem extends React.Component {

    static propTypes = {
        size:         React.PropTypes.number,
        image:        React.PropTypes.object.isRequired,
        index:        React.PropTypes.number.isRequired,
        onDrop:       React.PropTypes.string,
        className:    React.PropTypes.string,
        onDelete:     React.PropTypes.func,
        tournamentId: React.PropTypes.string
    };

    static  defaultProps = {
        size:      200,
        className: ''
    };

    render() {
        const styles = this.getStyles();

        let image;

        if (this.props.image.thumb) {
            if (typeof this.props.image.thumb == 'string') {
                image = <Image containerStyle={styles.image} src={this.props.image.thumb} width="150" height="150"/>;
            } else if (this.props.image.thumb.w) {
                image = <Image containerStyle={styles.image} src={this.props.image.thumb.src} width="150" height="150"/>;
            } else {
                image = <Image containerStyle={styles.image} width="150" height="150" alt="Ошибка загрузки"/>
            }
        } else {
            image = <Image width="150" height="150" alt="Ошибка загрузки"/>
        }

        return (
            <Dragon style={styles.root} element="div" message={this.props.index} onDrop={this.props.onDrop}>
                {image}
                <Button
                    style={styles.button}
                    iconClassName="mdfi_action_highlight_remove"
                    data-id={this.props.image._id}
                    data-type={this.props.image.type}
                    data-postid={this.props.image.postId}
                    onClick={this.props.onDelete}/>
            </Dragon>
        )
    }

    getStyles() {
        return {
            root:   {
                display:     'inline-block',
                position:    'relative',
                marginTop:   12,
                marginRight: (this.props.index + 1) % 7 != 0 ? 7 : 0
            },
            button: {
                position:   'absolute',
                top:        0,
                left:       0,
                width:      '100%',
                height:     '44%',
                color:      Colors.white,
                opacity:    0,
                transition: 'all .2s'
            },
            image:  {
                margin: '0 auto'
            }
        }
    }
}

module.exports = PhotosList;
