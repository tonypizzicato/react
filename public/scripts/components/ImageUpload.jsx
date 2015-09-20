const _            = require('lodash'),
      React        = require('react'),
      cx           = require('classnames'),
      mui          = require('material-ui'),

      Spacing      = mui.Styles.Spacing,
      Colors       = mui.Styles.Colors,

      Button       = mui.FlatButton,
      Icon         = mui.FontIcon,
      ActionButton = mui.FloatingActionButton,

      Image        = require('./Image.jsx');

class ImageUpload extends React.Component {

    static propTypes = {
        label:     React.PropTypes.string,
        image:     React.PropTypes.string,
        pos:       React.PropTypes.shape({
            x: React.PropTypes.string,
            y: React.PropTypes.string
        }),
        errorText: React.PropTypes.string,
        width:     React.PropTypes.string,
        height:    React.PropTypes.string
    };

    static getDefaultProps = {
        label:     "Выберите изображение",
        image:     null,
        pos:       {x: '50%', y: '50%'},
        errorText: null,
        width:  'auto',
        height: 'auto'
    };

    state = {
        uploaded: !!this.props.image,
        image:    this.props.image,
        isNew:    false
    };

    constructor(props) {
        super(props);

        this._onImage  = this._onImage.bind(this);
        this._onClick  = this._onClick.bind(this);
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

    _onClick() {
        _.delay(function () {
            this.refs.upload.getDOMNode().click();
        }.bind(this), 300);
    }

    getImage() {
        return this.state.uploaded ? (this._reader ? this._reader.result : this.state.image) : null;
    }

    setImagePos(x, y) {
        this.refs.preview.setImagePos(x, y);
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
            <Image style={styles.preview} src={this.state.image} width={this.props.width} height={this.props.height} pos={this.props.pos} ref="preview"/> : '';

        return (
            <div style={styles.root}>
                {image}
                <ActionButton style={styles.buttonClose} backgroundColor={'rgba(255, 64, 129, .5)'} iconClassName="mdfi_navigation_close"
                              onClick={this._onDelete}/>
                <input style={styles.input} type="file" onChange={this._onImage} ref="upload"/>

                <div style={styles.button.root}>
                    <Button style={styles.button.button} onClick={this._onClick}>
                        <Icon style={styles.button.icon} className="mdfi_image_photo"/>
                        <span style={styles.button.label}>{this.props.label}</span>
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
                marginTop: Spacing.desktopGutter
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
                margin:         this.state.uploaded ? `0 auto ${Spacing.desktopGutter}px` : 0,
                backgroundSize: 'cover'
            },
            button:      {
                root:   {
                    position: 'absolute',
                    width:    '100%',
                    bottom:   0,
                    left:     0,
                    zIndex:   1
                },
                button: {
                    width: '100%'
                },
                icon:   {
                    top: 6
                },
                label:  {
                    position: 'relative',
                    padding:  '0 16px'
                }
            },
            error:       {
                display:    'block',
                position:   'absolute',
                bottom:     -14,
                width:      '100%',
                textAlign:  'center',
                fontSize:   Spacing.desktopGutterLess,
                lineHeight: Spacing.desktopGutterLess,
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
            }
        }
    }
}

module.exports = ImageUpload;
