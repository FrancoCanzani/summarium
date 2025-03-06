export interface Note {
    id: number;
    title: string;
    content: string;
  }
  
  let nextId: number = 1;
  let notes: Note[] = [];
  
  export const createNote = (title: string, content: string): Note => {
    const newNote: Note = {
      id: nextId++,
      title,
      content,
    };
    notes.push(newNote);
    return newNote;
  };
  
  export const getNotes = (): Note[] => {
    return [...notes]; 
  };
  
  export const getNoteById = (id: number): Note | null => {
    return notes.find((note) => note.id === id) || null;
  };
  
  export const updateNote = (id: number, title: string, content: string): Note | null => {
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      notes[noteIndex] = { ...notes[noteIndex], title, content };
      return notes[noteIndex];
    }
    return null;
  };
  
  export const deleteNote = (id: number): boolean => {
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);
      return true;
    }
    return false;
  };