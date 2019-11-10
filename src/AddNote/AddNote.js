import React from "react";
import ValidationError from "../Error Boundaries/ValidationError";
import ApiContext from "../ApiContext";
import config from "../config";
import PropTypes from "prop-types";

import "./AddNote.css";

export default class AddNote extends React.Component {
  static contextType = ApiContext;
  constructor(props) {
    super(props);
    this.state = {
      //error: null,
      selectedFolder: {
        name: "--- Select a Folder ---",
        value: ""
        //touched: false
      },
      name: {
        value: "",
        touched: false
      },
      content: {
        value: "",
        touched: false
      }
    };
    this.contentInput = React.createRef();
    //this.handleChange = this.handleChange.bind(this);
  }
  updateTitle(e) {
    this.setState({
      name: {
        value: e.target.value,
        touched: true
      }
    });
  }

  validateTitle() {
    const name = this.state.name.value;
    if (name === "") {
      return "Title is required";
    }
  }

  updateContent(e) {
    this.setState({
      content: {
        value: e.target.value,
        touched: true
      }
    });
  }

  validateContent() {
    const content = this.state.content.value;
    if (!content) {
      return "Note is empty - enter content";
    }
  }

  handleFolderChange(e) {
    this.setState({
      selectedFolder: {
        name: e.target.name.value,
        value: e.target.value
        //touched: true
      }
    });
  }

  validateFolder() {
    const folder = this.state.selectedFolder.value;
    if (folder === "--- Select a Folder ---") {
      return "Select a Folder";
    }
  }

  //: e.target.value
  handleSubmit = e => {
    e.preventDefault();
    const { name } = e.target;
    const newNote = {
      name: name.value,
      modified: new Date(),
      content: this.contentInput.current.value,
      folder_id: this.state.selectedFolder.value
    };
    this.setState({ error: null });

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newNote)
    })
      .then(response => {
        if (!response.ok) return response.json().then(e => Promise.reject(e));
        return response.json();
      })

      .then(response => {
        this.context.addNote(response);
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
    const { folders = [] } = this.context;

    return (
      <div className="container">
        <form className="noteForm" onSubmit={e => this.handleSubmit(e)}>
          <fieldset className="noteFieldset">
            <legend>Create a Note</legend>

            <label htmlFor="note_input_title">
              Title
              <input
                id="note_input_title"
                //type="text"
                name="name"
                placeholder="Note Title"
                aria-label="Note Title"
                aria-required="true"
                onChange={e => this.updateTitle(e)}
              />
              {this.state.content.touched && (
                <ValidationError message={this.validateTitle()} />
              )}
            </label>

            <label htmlFor="note_input_content">
              Content
              {this.state.content.touched && (
                <ValidationError message={this.validateContent()} />
              )}
            </label>
            <textarea
              id="note_input_content"
              name="content"
              aria-label="insert note content"
              aria-required="true"
              ref={this.contentInput}
              onChange={e => this.updateContent(e)}
            ></textarea>

            {/*============================ */}

            <label htmlFor="selectFolder">Select a Folder</label>
            <select
              value={this.state.selectedFolder.name}
              id="note_selected_folder"
              aria-label="Select folder"
              aria-required="true"
              onChange={e => this.handleFolderChange(e)}
            >
              <option value="--- Select a Folder ---" name="folder_id">
                --- Select a Folder ---
              </option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id} name="folder_id">
                  {folder.name}
                </option>
              ))}
            </select>
            {<ValidationError message={this.validateFolder()} />}

            {/*============================ */}
          </fieldset>
          <button
            disabled={
              this.validateTitle() ||
              this.validateContent() ||
              this.validateFolder()
            }
            type="submit"
            className="addFolder btn"
          >
            Save Note
          </button>
        </form>
      </div>
    );
  }
}

Note.propTypes = {
  name: PropTypes.string,
  folder_id: PropTypes.number,
  content: PropTypes.string,
  modified: PropTypes.string
};
