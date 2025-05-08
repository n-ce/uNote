import { html, render } from 'uhtml';
import './style.css';
import { marked } from 'marked';

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
  topNoteText.innerHTML = marked(topNoteSaved) as string;

const notes = (savedNotes || {}) as { [index: string]: string };

const getTopNote = () => localStorage.getItem('topNote') || topNoteText.textContent || '';

function updateSaved() {
  const notesStr = JSON.stringify(notes);
  localStorage.setItem('notes', notesStr);
}

function loadEditor(
  src: 'top' | 'note' | 'new',
  id: string | undefined = undefined
) {

  if (src === 'top')
    textarea.value = getTopNote();
  if (src === 'new')
    textarea.value = '';
  if (src === 'note' && id)
    textarea.value = notes[id];

  textarea.dataset.id = id || src;
  editor.showModal();
}

topNote.addEventListener('click', e => {
  if ((e.target as HTMLAnchorElement).matches('button')) return;
  e.preventDefault();
  loadEditor('top');

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

    const id = textarea.dataset.id === 'new' ? Date.now().toString() : textarea.dataset.id;
    if (id && id !== 'top') {
      notes[id] = getTopNote();
      uNote();
    }
    topNoteText.innerHTML = marked(textarea.value) as string;
    localStorage.setItem('topNote', textarea.value);
  }

  textarea.value = '';
})


newBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loadEditor('new')
});

function uNote() {
  console.log(notes);

  function note(id: string, v: string) {
    function handleclick(e: Event) {
      const elm = e.target as HTMLElement;
      e.preventDefault();
      if (elm.matches('button')) {
        delete notes[id];
        uNote();
      } else {
        loadEditor('note', id);
      }
    }
    const p = document.createElement('p');
    p.innerHTML = marked(v) as string;

    return html`<a href="#" @click=${handleclick}>
      ${p}
      <button>del</button>
    </a>`;
  }

  updateSaved();
  render(noteList, html`${Object.entries(notes).map(([id, text]) => note(id, text))}`)
}

if (savedNotesString)
  uNote();
