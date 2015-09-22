const React        = require('react'),
      mui          = require('material-ui'),

      Spacing      = mui.Styles.Spacing,
      Colors       = mui.Styles.Colors,

      RaisedButton = mui.RaisedButton,
      FontIcon     = mui.FontIcon;

class HelpButton extends React.Component {
    static propTypes = {
        dialog: React.PropTypes.element.required
    };

    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
    }

    _onClick() {
        this.props.dialog.show();
    }

    render() {
        const styles = this.getStyles();

        return (
            <RaisedButton
                style={styles.root}
                labelStyle={styles.label}
                secondary={true}
                backgroundColor={Colors.blue500}
                onTouchTap={this._onClick}
                label="Справка"
                labelPosition="after">
                <FontIcon style={styles.icon} className="mdfi_action_help"/>
            </RaisedButton>
        );
    }

    getStyles() {
        return {
            root:  {
                width:     '100%',
                marginTop: Spacing.desktopGutter
            },
            label: {
                padding: '0 8px'
            },
            icon:  {
                verticalAlign: 'middle',
                top:           '-3px',
                fontSize:      '22px',
                color:         Colors.white
            }
        }
    }
}

module.exports = HelpButton;
