import { html, render } from 'uhtml';
import './style.css';

const editor = document.getElementById('editor') as HTMLDialogElement;
const topNote = document.getElementById('topNote') as HTMLAnchorElement;
const noteList = document.getElementById('noteList') as HTMLDivElement;
const textarea = editor.firstElementChild as HTMLTextAreaElement;
const saveBtn = editor.lastElementChild as HTMLButtonElement;
const topNoteText = topNote.firstElementChild as HTMLParagraphElement;
const newBtn = topNote.lastElementChild as HTMLButtonElement;

let savedNotesString = localStorage.getItem('notes');
let savedNotes;
if (savedNotesString)
  savedNotes = JSON.parse(savedNotesString);
const topNoteSaved = localStorage.getItem('topNote');
if (topNoteSaved)
  topNoteText.textContent = topNoteSaved;

const notes = (savedNotes || {}) as { [index: string]: string };

function updateSaved() {
  const notesStr = JSON.stringify(notes);
  localStorage.setItem('notes', notesStr);
}

function loadEditor(id: string | undefined | Event = undefined) {
  if (typeof id !== 'string')
    id = '';

  if (typeof id === 'undefined') {
    textarea.value = topNoteText.textContent as string;
  }
  else if (id)
    textarea.value = notes[id];

  textarea.dataset.id = id;
  editor.showModal();
}

topNote.addEventListener('click', e => {
  e.preventDefault();
  loadEditor();
})

addEventListener('popstate', () => {
  if (editor.open) {
    editor.close();
    console.log('yes that wss back')
  }

})

saveBtn.addEventListener('click', () => {
  editor.close();
  if (textarea.value) {

    const id = textarea.dataset.id || Date.now().toString();
    notes[id] = (localStorage.getItem('topNote') || topNoteText.textContent) as string;
    uNote();
    topNoteText.textContent = textarea.value;
    localStorage.setItem('topNote', textarea.value);
  }

  textarea.value = '';
})


newBtn.addEventListener('click', loadEditor);

function uNote() {
  console.log(notes);

  const note = (id: string, v: string) => html`<a href="#" @click=${(e: Event) => {
    const elm = e.target as HTMLElement;
    e.preventDefault();
    if (elm.matches('button')) {
      delete notes[id];
      uNote();
    } else {
      loadEditor(id);
    }
  }}
    >
      <p>${v}</p>
      <button>del</button>
    </a>`;

  updateSaved();
  render(noteList, html`${Object.entries(notes).map(([id, text]) => note(id, text))}`)
}

if (savedNotesString)
  uNote();
