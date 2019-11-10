export const findFolder = (folders = [], folder_id) =>
  folders.find(folder => parseInt(folder.id) === parseInt(folder_id));

export const findNote = (notes = [], noteId) =>
  //notes.find(note => note.id === noteId);
  notes.find(note => parseInt(note.id) === parseInt(noteId));

export const getNotesForFolder = (notes = [], folder_id) =>
  !folder_id
    ? notes
    : notes.filter(note => note.folder_id === parseInt(folder_id));

export const countNotesForFolder = (notes = [], folder_id) =>
  notes.filter(note => note.folder_id === parsInt(folder_id)).length;
