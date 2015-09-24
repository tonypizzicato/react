const _            = require('lodash'),
      React        = require('react'),
      mui          = require('material-ui'),

      Spacing      = mui.Styles.Spacing,

      Dropzone     = require('dropzone'),

      ActionButton = mui.FloatingActionButton;

class DropzoneComponent extends React.Component {

    static propTypes = {
        url:            React.PropTypes.string.required,
        uploadMultiple: React.PropTypes.bool,
        onUpload:       React.PropTypes.func,
        onChunkUpload:  React.PropTypes.func
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
