import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

class Notify extends React.Component {
  state = {
    open: this.props.open
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  handleClick = state => () => {
    this.setState({ open: true, ...state });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Snackbar
          autoHideDuration={1000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.open}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.props.message}</span>}
        />
      </div>
    );
  }
}

export default Notify;
