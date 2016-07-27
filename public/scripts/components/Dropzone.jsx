import React, { Component, PropTypes } from 'react';

import Dropzone from 'dropzone';

import Spacing from 'material-ui/styles/spacing';
import ActionButton from 'material-ui/FloatingActionButton';

class DropzoneComponent extends Component {

    static propTypes = {
        url:            PropTypes.string.isRequired,
        uploadMultiple: PropTypes.bool,
        onUpload:       PropTypes.func,
        onChunkUpload:  PropTypes.func
    };

    static defaultProps = {
        uploadMultiple: true
    };

    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
    }

    _onClick() {
        this._loader.processQueue();
    }

    componentDidMount() {
        this._loader = new Dropzone(this.refs.dropzone.getDOMNode(), {
            url:              this.props.url,
            autoProcessQueue: false,
            parallelUploads:  10,
            addRemoveLinks:   true,
            uploadMultiple:   this.props.uploadMultiple
        });

        this._loader.on('completemultiple', this._loader.processQueue);

        if (this.props.onUpload) {
            this._loader.on('processingmultiple', this.props.onUpload);
        }

        if (this.props.onChunkUpload) {
            this._loader.on('completemultiple', this.props.onChunkUpload);
        }
    }

    render() {
        const styles = this.getStyles();

        return (
            <div style={styles.root}>
                <div style={styles.dropzone} className="dropzone" ref="dropzone"/>
                <ActionButton style={styles.button} iconClassName="mdfi_file_file_upload" onClick={this._onClick}/>
            </div>
        );
    }

    getStyles() {
        return {
            root:     {
                marginTop: Spacing.desktopGutter
            },
            dropzone: {
                border: '2px dashed #34495e',
                zIndex: 1
            },
            button:   {
                position:  'absolute',
                marginTop: 12,
                right:     0,
                zIndex:    10
            }
        }
    }
}

module.exports = DropzoneComponent;
