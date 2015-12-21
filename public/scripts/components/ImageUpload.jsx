const _            = require('lodash'),
      React        = require('react'),
      cx           = require('classnames'),
      mui          = require('material-ui'),

      Styles       = mui.Utils.Styles,
      Spacing      = mui.Styles.Spacing,
      Colors       = mui.Styles.Colors,

      Button       = mui.FlatButton,
      Icon         = mui.FontIcon,
      ActionButton = mui.FloatingActionButton,

      Image        = require('./Image.jsx');

class ImageUpload extends React.Component {

    static propTypes = {
        label:      React.PropTypes.string,
        image:      React.PropTypes.string,
        imageStyle: React.PropTypes.object,
        pos:        React.PropTypes.shape({
            x: React.PropTypes.string,
            y: React.PropTypes.string
        }),
        errorText:  React.PropTypes.string,
        width:      React.PropTypes.string,
        height:     React.PropTypes.string,
        deletable:  React.PropTypes.bool
    };

    static defaultProps = {
        label:      "Выберите изображение",
        image:      null,
        imageStyle: {},
        pos:        {x: '50%', y: '50%'},
        errorText:  null,
        width:      'auto',
        height:     'auto',
        deletable:  true
    };

    state = {
        uploaded: !!this.props.image,
        image:    this.props.image,
        isNew:    false
    };

    constructor(props) {
        super(props);

        this._onImage  = this._onImage.bind(this);
        this._onDelete = this._onDelete.bind(this);
    }

    _onImage() {
        this._reader = new FileReader();
        this._reader.readAsDataURL(this.refs.upload.getDOMNode().files[0]);

        this._reader.onload = function (e) {

            this.setState({
                image:    e.target.result,
                uploaded: true,
                isNew:    true
            });
        }.bind(this);
    }

    getImage() {
        return this.state.uploaded ? (this._reader ? this._reader.result : this.state.image) : null;
    }

    setImagePos(x, y) {
        this.refs.preview && this.refs.preview.setImagePos(x, y);
    }

    isNew() {
        return this.state.isNew;
    }

    getFile() {
        return this.refs.upload.getDOMNode().files[0];
    }

    setImage(image) {
        this.setState({
            image:    image,
            uploaded: !!image
        })
    }

    _onDelete() {
        this.setState({
            image:    null,
            uploaded: false,
            isNew:    true
        });
    }

    render() {
        const styles = this.getStyles();

        const error = this.props.errorText ? (<span style={styles.error}>{this.props.errorText}</span>) : '';
        const image = this.state.image ?
            <Image
                style={Styles.mergeAndPrefix(styles.preview, this.props.imageStyle)}
                src={this.state.image}
                width={this.props.width}
                height={this.props.height}
                pos={this.props.pos}
                ref="preview"/> : '';

        let deleteButton;
        if (this.props.deletable) {
            deleteButton = <ActionButton
                style={styles.buttonClose}
                backgroundColor={'rgba(255, 64, 129, .5)'}
                iconClassName="mdfi_navigation_close"
                onClick={this._onDelete}/>
        }
        return (
            <div style={styles.root}>
                {image}
                {deleteButton}

                <div style={styles.button.root}>
                    <Button secondary={true} label={this.props.label} style={styles.button.button}>
                        <Icon style={styles.button.icon} className="mdfi_image_photo"/>
                        <input type="file" ref="upload" style={styles.button.input} onChange={this._onImage}/>
                    </Button>
                    {error}
                </div>
            </div>
        );
    }

    getStyles() {
        return {
            root:        {
                position:  'relative',
                marginTop: Spacing.desktopGutterMore
            },
            buttonClose: {
                position: 'absolute',
                top:      0,
                right:    0,
                display:  this.state.uploaded ? 'block' : 'none'
            },
            input:       {
                position: 'relative',
                left:     -2000
            },
            preview:     {
                width:          '100%',
                height:         this.state.uploaded ? '100%' : 0,
                margin:         this.state.uploaded ? `0 auto ${Spacing.desktopGutterLess}px` : 0,
                backgroundSize: 'cover'
            },
            button:      {
                root:   {
                    width:         '100%',
                    paddingBottom: Spacing.desktopGutterMini
                },
                button: {
                    width: '100%'
                },
                icon:   {
                    top: 6
                },
                input:  {
                    position: 'absolute',
                    cursor:   'pointer',
                    top:      '0',
                    bottom:   '0',
                    right:    '0',
                    left:     '0',
                    width:    '100%',
                    opacity:  '0'
                }
            },
            error:       {
                display:    'block',
                position:   'absolute',
                width:      '100%',
                textAlign:  'center',
                fontSize:   '12px',
                lineHeight: '12px',
                color:      Colors.red600,
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
            }
        }
    }
}

module.exports = ImageUpload;
