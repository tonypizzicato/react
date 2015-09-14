const React      = require('react'),
      mui        = require('material-ui'),

      Colors     = mui.Styles.Colors,
      Spacing    = mui.Styles.Spacing,

      ListItem   = mui.ListItem,
      Card       = mui.Card,
      CardHeader = mui.CardHeader,
      CardText   = mui.CardText,
      Avatar     = mui.Avatar;

class OrderItem extends React.Component {

    static propTypes = {
        order: React.PropTypes.object
    }

    render() {
        return (
            <Card style={this.getStyles().root}>
                <CardHeader
                    title={this.props.order.name}
                    subtitle={this.props.order.email}
                    avatar={<Avatar>{this.props.order.name[0]}</Avatar>}
                    showExpandableButton={true}>
                </CardHeader>
                <CardText expandable={true} initiallyExpanded={false}>
                    <span>Имя: {this.props.order.name}</span><br />
                    <span>Email: {this.props.order.email}</span><br />
                    <span>Желаемый район: {this.props.order.region}</span><br />
                    <span>Желаемая лига: {this.props.order.league}</span><br />
                    <span>Желаемая команда: {this.props.order.team}</span><br />
                    <span>Источник: {this.props.order.source}</span><br />
                </CardText>
            </Card>
        );
    }

    getStyles() {
        return {
            root: {
                marginBottom: Spacing.desktopGutterLess
            }
        }
    }
}

module.exports = OrderItem;
