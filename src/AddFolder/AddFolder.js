import React from "react";
import { Link } from "react-router-dom";
import CircleButton from "../CircleButton/CircleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ValidationError from "../Error Boundaries/ValidationError";
import ApiContext from "../ApiContext";
import config from "../config";
import "./AddFolder.css";

export default class AddFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      name: {
        value: "",
        touch: false
      }
    };
  }
  static defaultProps = {
    //onAddFolder: () => {}
  };

  static contextType = ApiContext;

  //state = {
  //error: null
  //};
  handleChange(e) {
    this.setState({
      name: {
        value: e.target.value,
        touch: true
      }
    });
    console.log(this.state.name.value);
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0 || name.touch === false) {
      return "Note title is required";
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    //const folderId = this.props.id;
    const { name } = e.target;
    const newFolder = {
      name: name.value
    };

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newFolder)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw error;
          });
        }
        return response.json();
      })
      .then(response => {
        this.context.addFolder(response);
      })

      .then(() => {
        this.props.history.push("/");
      })

      .catch(error => {
        this.setState({ error });
        console.error({ error });
      });
  };

  render() {
    return (
      <div className="folderContainer">
        <Link to="/">
          <CircleButton
            tag="button"
            role="link"
            className="NotePageNav__back-button"
          >
            <FontAwesomeIcon icon="chevron-left" />
            <br />
            Back
          </CircleButton>
        </Link>
        <form onSubmit={e => this.handleSubmit(e)} className="folderForm">
          <fieldset>
            <legend>Create a folder</legend>
            <label htmlFor="selectFolder">
              <span>Folder Name</span>
            </label>
            <input
              className="newFolder"
              type="text"
              name="name"
              aria-label="New Folder Title"
              aria-required="true"
              onChange={e => this.handleChange(e)}
            />
            {this.state.name.touch && (
              <ValidationError message={this.validateName()} />
            )}
            <br />
            <br />
            <button
              type="submit"
              className="addFolder btn"
              disabled={this.validateName()}
            >
              Add folder
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}
