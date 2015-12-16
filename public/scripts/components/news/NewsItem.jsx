import cx from 'classnames';
import date from '../../utils/date';
import React, { Component, PropTypes} from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Spacing from 'material-ui/lib/styles/spacing';

import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Icon from 'material-ui/lib/font-icon';

import Dragon from '../Dragon.jsx';

class NewsItem extends Component {

    static propTypes = {
        index:    PropTypes.number.isRequired,
        article:  PropTypes.object.isRequired,
        onDelete: PropTypes.func.isRequired,
        onEdit:   PropTypes.func.isRequired,
        onDrop:   PropTypes.func.isRequired
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
                top:         2,
                fontSize:    18,
                color:       this.props.article.show ? Colors.blueGrey900 : Colors.lightBlack
            }
        }
    }
}

module.exports = NewsItem;
