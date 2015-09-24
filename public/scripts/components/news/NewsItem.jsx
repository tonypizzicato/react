const React    = require('react'),
      cx       = require('classnames'),
      mui      = require('material-ui'),
      date     = require('../../utils/date'),

      Colors   = mui.Styles.Colors,
      Spacing  = mui.Styles.Spacing,

      Dragon   = require('../Dragon.jsx'),

      ListItem = mui.ListItem,
      Avatar   = mui.Avatar,
      Icon     = mui.FontIcon;


class NewsItem extends React.Component {

    static propTypes = {
        index:    React.PropTypes.number.isRequired,
        article:  React.PropTypes.object.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onEdit:   React.PropTypes.func.isRequired,
        onDrop:   React.PropTypes.func.isRequired
    };

    static defaultProps = {
        article: {}
    };

    render() {
        const styles = this.getStyles();
        const avatar = this.props.article.title;

        const visibilityClass = cx({
            'mdfi_action_visibility':     true,
            'mdfi_action_visibility_off': !this.props.article.show
        });

        return (
            <ListItem
                style={styles.root}
                onTouchTap={this.props.onEdit}
                data-id={this.props.article._id}
                leftAvatar={<Avatar>{avatar[0]}</Avatar>}
                primaryText={
                            <p>
                                <Icon style={styles.visibilityIcon} className={visibilityClass} />
                                <span style={styles.label.name}>{this.props.article.title}</span>
                                <span style={{color: Colors.minBlack}}>{date.format(this.props.article.dc)}</span>
                            </p>
                        }
                secondaryText={
                            <p>
                                <span style={{color: Colors.minBlack}}>{this.props.article.state}</span><br/>
                                <span style={{color: Colors.lightBlack}}>{this.props.article.author}</span>
                            </p>
                        }
                secondaryTextLines={2}
                />
        );
    }

    getStyles() {
        return {
            root:           {
                margin: Spacing.desktopGutter + ' 0'
            },
            label:          {
                name: {
                    marginRight: Spacing.desktopGutterMini
                }
            },
            visibilityIcon: {
                marginRight: 6,
                top:         4,
                color:       this.props.article.show ? Colors.blueGrey900 : Colors.lightBlack
            }
        }
    }
}

module.exports = NewsItem;
