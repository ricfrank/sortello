import React from "react";
import Header from './Header.jsx';
import TreeDraw from './TreeDraw.jsx';
import Card from './Card.jsx';
import treeRebalancer from "../model/treeRebalancer";

const Choices = React.createClass({
  getInitialState: function () {
    return {
      Trello: this.props.Trello,
      leftNode: null,
      rightNode: null,
      currentTree: {value: 0, left: 0, right: 0},
      progress: 0
    }
  },
  componentDidUpdate(){
    this.props.centerContent();
  },
  componentDidMount(){
    this.props.centerContent();
  },
  endChoices: function (rootNode) {
    this.props.setSortedRootNode(rootNode);
  },
  startChoices: function () {

    this.props.setStartTimeStamp(Date.now())

    var nodes = this.props.nodes;
    var rootNode = this.props.rootNode;
    var component = this;

    function getChoice (node, compareNode, currNode) {
      component.setState({
        leftNode: node,
        rightNode: compareNode
      });

      jQuery(".card-button__vote").click(function () {
        if ($(this).attr("id") == "left_button") {
          compareNode = node.goLeft(compareNode);
        } else if ($(this).attr("id") == "right_button") {
          compareNode = node.goRight(compareNode);
        }
        jQuery(".card-button__vote").unbind("click");
        if (node.isPositioned) {
          rootNode = treeRebalancer(rootNode);
          component.setState({
            currentTree: rootNode,
            progress: Math.round(((100 * currNode + 1) / (nodes.length - 1)))
          });
          choicesCycle(currNode + 1);
        } else {
          getChoice(node, compareNode, currNode);
        }
      });
    }

    function choicesCycle (currNode) {
      if (currNode < nodes.length) {
        getChoice(nodes[currNode], rootNode, currNode);
      } else {
        jQuery("#left_button").html("");
        jQuery("#right_button").html("");
        component.endChoices(rootNode);
      }
    }

    choicesCycle(1);
  },
  render: function () {
    if (this.state.leftNode == null || this.state.rightNode == null) {
      return (<span>Loading...</span>);
    }
    return (
      <div id="second_div">
        <div className="container__choose-card">
          <div className="choose-card__heading">Select the highest priority card</div>
          <Card id="left_button" data={this.state.leftNode.value}/>
          <Card id="right_button" data={this.state.rightNode.value}/>
          <div className={"logout__button"}>
            <Header />
          </div>
          {/*<TreeDraw tree={this.state.currentTree}></TreeDraw>*/}
        </div>
        <div className="container__prioritization-status">
          <div className="text__prioritization-status">Prioritization status</div>
          <div className={"progressive-bar__status-structure"}>
            <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.state.progress} aria-valuemin="0"
                 aria-valuemax="100" style={{width: this.state.progress + '%'}}>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default Choices
