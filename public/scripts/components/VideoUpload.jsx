const _            = require('lodash'),
      React        = require('react'),
      mui          = require('material-ui'),

      Spacing      = mui.Styles.Spacing,

      DropDownMenu = mui.DropDownMenu,
      TextField    = mui.TextField,

      Image        = require('./Image.jsx');

class VideoUpload extends React.Component {

    static propTypes = {
        types:     React.PropTypes.array,
        type:      React.PropTypes.string,
        label:     React.PropTypes.string,
        url:       React.PropTypes.string,
        errorText: React.PropTypes.string
    };

    static defaultProps = {
        types: ['youtube', 'vimeo', 'vk'],
        type:  'youtube'
    };

    state = {
        typeIndex: this.props.types.indexOf(this.props.type)
    };

    constructor(props) {
        super(props);

        this._onTypeChange = this._onTypeChange.bind(this);
    }

    getValue() {
        return {
            url:   this.refs.url.getValue(),
            label: this.refs.label.getValue(),
            type:  this.props.types[this.state.typeIndex]
        }
    }

    clear() {
        this.setState({typeIndex: this.props.types.indexOf(this.props.type)});
        this.refs.url.setValue('');
        this.refs.label.setValue('');
    }

    _onTypeChange(e, index) {
        this.setState({typeIndex: index});
    }

    render() {
        const styles = this.getStyles();

        const items = this.props.types.map(type => {
            return {text: type, type: type}
        });

        return (
            <div style={styles.root}>
                <DropDownMenu
                    style={styles.dropdown.root}
                    labelStyle={styles.dropdown.label}
                    underlineStyle={styles.dropdown.underline}
                    menuItems={items}
                    selectedIndex={this.state.typeIndex}
                    autoWidth={false}
                    onChange={this._onTypeChange}
                    ref="type"/>

                <div style={styles.inputContainer}>
                    <TextField
                        style={styles.inputFirst}
                        defaultValue={this.props.url}
                        hintText="Введите embed ссылку"
                        ref="url"/>
                    <TextField
                        style={styles.input}
                        defaultValue={this.props.label}
                        hintText="Введите название видео"
                        floatingLabelText="Заголовок"
                        ref="label"/>
                </div>
            </div>
        );
    }

    getStyles() {
        return {
            root:           {
                marginBottom: Spacing.desktopGutter
            },
            inputContainer: {
                width:      '88%',
                marginLeft: '12%'
            },
            input:          {
                width: '48%'
            },
            inputFirst:     {
                width:       '48%',
                marginRight: '4%'
            },
            dropdown:       {
                root:      {
                    float: 'left',
                    width: '10%',
                    top:   Spacing.desktopGutterLess
                },
                label:     {
                    paddingLeft: 0
                },
                underline: {
                    margin: '-1px 12px 0 0'
                }
            }
        }
    }
}

module.exports = VideoUpload;
