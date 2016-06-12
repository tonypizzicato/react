const $            = require('jquery'),
      cx           = require('classnames'),
      React        = require('react'),
      mui          = require('material-ui'),

      Styles       = mui.Utils.Styles,

      Spacing      = mui.Styles.Spacing,
      Colors       = mui.Styles.Colors,

      MediumEditor = require('medium-editor');


class Editor extends React.Component {

    static propTypes = {
        id:                React.PropTypes.string,
        defaultValue:      React.PropTypes.string,
        hintText:          React.PropTypes.string,
        errorText:         React.PropTypes.string,
        floatingLabelText: React.PropTypes.string
    };

    static defaultProps = {
        id:                undefined,
        defaultValue:      '',
        floatingLabelText: 'Текст',
        hintText:          'Введите текст для редактирования'
    };

    state = {
        mounted:   false,
        activated: false,
        hasValue:  this.props.defaultValue.length > 0,
        errorText: this.props.errorText
    };

    constructor(props) {
        super(props);

        this._handleBlur   = this._handleBlur.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    getValue() {
        var value = '';

        if (this.state.mounted) {
            var reg = /<(\w+)(?:\s+\w+="[^"]+(?:"\$[^"]+"[^"]+)?")*>(?:\s*|<\w+\s*\/?>)<\/\1>/gi;
            value   = this._editor.serialize()['element-0'].value;
            value   = value.replace(reg, '');
        }

        this.setValue(value);

        return value;
    }

    setValue(value) {
        this.setState({value: value});
        this.refs.editor.getDOMNode().innerHTML = value ? value : '';
    }

    _handleBlur(e) {
        var focus = e.type == 'focus';

        if (!focus && (!e.relatedTarget || e.relatedTarget.className.indexOf('medium-editor-action') === -1)) {
            this.setState({activated: false});
        } else {
            this.setState({activated: true});
        }
    }

    _handleChange() {
        this.setState({hasValue: !!this._editor.serialize()});
    }

    _initEditor() {
        this._editor = new MediumEditor(this.refs.editor.getDOMNode(), {
            placeholder:         false,
            disableDoubleReturn: true,
            targetBlank:         true,
            toolbar:             {
                buttons: ['header1', 'header2', 'bold', 'italic', 'anchor', 'quote', 'unorderedlist', 'orderedlist', 'justifyFull', 'justifyLeft', 'justifyCenter', 'justifyRight', 'indent'],
            }
        });

        console.log('editor initialization');

        this.refs.editor.getDOMNode().innerHTML = this.props.defaultValue;
        this._editor.subscribe('editableInput', this._handleChange);
        this._editor.on(this.refs.editor.getDOMNode(), 'focus', this._handleBlur);
        this._editor.on(this.refs.editor.getDOMNode(), 'blur', this._handleBlur);
    }

    _deinitEditor() {
        this._editor.off(this.refs.editor.getDOMNode(), 'input', this._handleChange);
        this._editor.off(this.refs.editor.getDOMNode(), 'click', this._handleBlur);
        this._editor.off(this.refs.editor.getDOMNode(), 'blur', this._handleBlur);
    }

    componentDidMount() {
        this.setState({mounted: true});
        this._initEditor();
    }

    componentWillUnmount() {
        this.setState({mounted: false});
        this._deinitEditor();
    }

    componentWillReceiveProps(nextProps) {
        //if (nextProps.hasOwnProperty('errorText')) {
        //    this.setState({errorText: nextProps.errorText});
        //}
    }

    render() {
        const styles = this.getStyles();

        const className = cx('mui-edit-field', {
            'mui-is-focused':          this.state.activated,
            'mui-has-value':           this.state.hasValue,
            'mui-has-error':           !!this.props.errorText,
            'mui-has-floating-labels': !!this.props.floatingLabelText
        });

        const styleFloatingLabel = Styles.mergeAndPrefix(
            styles.floatingLabel.root,
            !!this.props.floatingLabelText ? styles.floatingLabel.hasFloatingLabel : {},
            this.state.hasValue ? styles.floatingLabel.hasValue : {},
            this.state.activated ? styles.floatingLabel.isFocused : {}
        );

        const styleHint = Styles.mergeAndPrefix(
            styles.hint.root,
            !!this.props.floatingLabelText ? styles.hint.hasFloatingLabel : {},
            this.state.activated ? styles.hint.isFocused : {},
            this.state.hasValue && this.state.activated ? styles.hint.isFocusedAndHasValue : {}
        );

        const styleHr = Styles.mergeAndPrefix(
            styles.hr.root
        );

        const styleHrFocused = Styles.mergeAndPrefix(
            styles.hr.root,
            styles.hr.onFocused,
            this.state.activated ? styles.hr.isFocused : {},
            !!this.props.errorText ? styles.hr.hasError : {}
        );

        const inputId = this.props.id;

        const floatingLabelTextElement = this.props.floatingLabelText ? (
            <label style={styleFloatingLabel} htmlFor={inputId}>{this.props.floatingLabelText}</label>
        ) : null;

        const hintTextElement = this.props.hintText ? (
            <div style={styleHint}>{this.props.hintText}</div>
        ) : null;

        const errorTextElement = this.props.errorText ? (
            <div style={styles.error}>{this.props.errorText}</div>
        ) : null;

        return (
            <div className={className} ref="content">
                {floatingLabelTextElement}
                {hintTextElement}

                <div style={styles.editable.root} className="editable" ref="editor"/>

                <hr style={styleHr}/>
                <hr style={styleHrFocused}/>

                {errorTextElement}
            </div>
        )
    }

    getStyles() {
        return {
            root:          {},
            floatingLabel: {
                root:             {
                    position:   'absolute',
                    lineHeight: '48px',
                    fontSize:   16,
                    color:      'rgba(0, 0, 0, 0.3)',
                    opacity:    1,
                    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
                },
                hasFloatingLabel: {
                    top:             Spacing.desktopGutter,
                    transform:       'scale(1) translate3d(0, 0, 0)',
                    transformOrigin: 'left top'
                },
                hasValue:         {
                    transform: 'scale(.75) translate3d(0, -18px, 0)',
                    color:     'rgba(0, 0, 0, 0.5)'
                },
                isFocused:        {
                    transform: 'scale(.75) translate3d(0, -18px, 0)',
                    color:     '#00bcd4'
                }
            },
            hint:          {
                root:                 {
                    position:   'absolute',
                    lineHeight: '48px',
                    fontSize:   16,
                    color:      'rgba(0, 0, 0, 0.3)',
                    opacity:    1,
                    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
                },
                hasFloatingLabel:     {
                    top:     24,
                    opacity: 0
                },
                isFocused:            {
                    opacity: 1
                },
                isFocusedAndHasValue: {
                    opacity: 0
                }
            },
            error:         {
                display:    'block',
                position:   'absolute',
                bottom:     -10,
                width:      '100%',
                fontSize:   '12px',
                lineHeight: '12px',
                color:      Colors.red600,
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
            },
            hr:            {
                root:      {
                    position:     'absolute',
                    width:        '100%',
                    bottom:       8,
                    margin:       0,
                    border:       'none',
                    borderBottom: 'solid 1px #e0e0e0'
                },
                onFocused: {
                    transform:  'scaleX(0)',
                    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
                },
                isFocused: {
                    borderColor: '#00bcd4',
                    transform:   'scaleX(1)',
                    borderWidth: 2
                },
                hasError:  {
                    transform:   'scaleX(1)',
                    borderColor: Colors.red600,
                    borderWidth: 2
                }
            },
            editable:      {
                root: {
                    position:        'relative',
                    width:           '100%',
                    border:          'none',
                    outline:         'none',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    color:           'rgba(0, 0, 0, 0.87)',
                    overflow:        'hidden',
                    fontSize:        16,
                    lineHeight:      '24px',
                    padding:         '36px 0 14px'
                },
                p:    {}

            }
        }
    }
}

module.exports = Editor;
