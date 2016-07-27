import React, { Component, PropTypes} from 'react';

import * as Colors from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';

import Button from 'material-ui/FlatButton';
import ActionButton from 'material-ui/FloatingActionButton';

import CloseIcon from 'material-ui/svg-icons/navigation/close';
import PhotoIcon from 'material-ui/svg-icons/image/photo';

import Image from './Image.jsx';

class ImageUpload extends Component {

    static propTypes = {
        label:      PropTypes.string,
        image:      PropTypes.string,
        imageStyle: PropTypes.object,
        pos:        PropTypes.shape({
            x: PropTypes.string,
            y: PropTypes.string
        }),
        errorText:  PropTypes.string,
        width:      PropTypes.string,
        height:     PropTypes.string,
        deletable:  PropTypes.bool
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
        this._reader.readAsDataURL(this.refs.upload.files[0]);

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
                style={{...styles.preview, ...this.props.imageStyle}}
                src={this.state.image}
                width={this.props.width}
                height={this.props.height}
                pos={this.props.pos}
                ref="preview"/> : '';

        let deleteButton;
        if (this.state.image && this.props.deletable) {
            deleteButton = <ActionButton style={styles.buttonClose} onClick={this._onDelete}><CloseIcon color={Colors.white}/></ActionButton>
        }
        return (
            <div style={styles.root}>
                {image}
                {deleteButton}

                <div style={styles.button.root}>
                    <Button secondary={true} label={this.props.label} labelPosition="after" style={styles.button.button}>
                        <PhotoIcon style={styles.button.icon}/>
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
                    position: 'relative',
                    top:      6,
                    fill:     Colors.cyan500
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

export default ImageUpload;