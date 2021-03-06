import React from 'react';
import PropTypes from 'prop-types';

export default class TaskRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isChecked: props.task.completed, task: props.task};
  }

  componentDidMount() {
    this.resizeTextArea(this.textArea);
  }

  componentWillReceiveProps(newProps) {
    this.setState({task: newProps.task, isChecked: newProps.task.completed});

    // Wait till after render
    setTimeout(() => {
      this.resizeTextArea(this.textArea);
    }, 1);
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked
    }));

    handleCheckboxChange(this.props.task);
  }

    onTextChange = (event) => {
    var text = event.target.value;
    this.props.task.setContentString(text);
    this.props.handleTextChange(this.props.task, text);

    this.forceUpdate();
  }

  onKeyUp = (event) => {
    // Delete task if empty and enter (13), backspace (8), or delete (46) are pressed
    if(event.key == "Enter"||event.keyCode == 13 || event.keyCode == 8 || event.keyCode == 46) {
      if(this.props.task.isEmpty()) {
        this.props.deleteTask(this.props.task);
        event.preventDefault();
      }
    }
    var element = event.target;
    this.resizeTextArea(element);
  }

  onKeyPress = (event) => {
    if(event.key == "Enter") {
      // We want to disable any action on enter, since newlines are reserved
      // and are how tasks are delimited.
      event.preventDefault();
    }
  }

  resizeTextArea(textarea) {
    // set to 1 first to reset scroll height in case it shrunk
    textarea.style.height = "1px";
    textarea.style.height = (textarea.scrollHeight)+"px";
  }

  render() {
    let { isChecked } = this.state;

    let task = this.props.task;

    let classes = `task ${task.completed ? 'completed' : ''}`
    return (
      <div className={classes}>

        <label className="checkbox-container">
          <input
            type="checkbox"
            value={task.content}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
            className="checkbox"
          />
          <span className="checkmark"></span>
        </label>

        <textarea
          ref={(textarea) => {this.textArea = textarea}}
          value={task.content}
          onChange={this.onTextChange}
          onKeyUp={this.onKeyUp}
          onKeyPress={this.onKeyPress}
          type="text"
          dir="auto"
          className='task-input-textarea'
        />
      </div>
    );
  }
}

TaskRow.propTypes = {
  task: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};
