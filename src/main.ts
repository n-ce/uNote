import { html, render } from 'uhtml';
import './style.css';

const editor = document.getElementById('editor') as HTMLDialogElement;
const topNote = document.getElementById('topNote') as HTMLAnchorElement;
const noteList = document.getElementById('noteList') as HTMLDivElement;
const textarea = editor.firstElementChild as HTMLTextAreaElement;
const saveBtn = editor.lastElementChild as HTMLButtonElement;
const topNoteText = topNote.firstElementChild as HTMLParagraphElement;
const newBtn = topNote.lastElementChild as HTMLButtonElement;

let newNote = false;
const notes = {} as { [index: string]: string };

function loadEditor(id: string | undefined = undefined) {

  if (id) {
    textarea.value = notes[id];
    textarea.dataset.id = id;
  }

  newNote = id === undefined;
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
    const id = newNote ? Date.now().toString() : (textarea.dataset.id as string);
    notes[id] = textarea.value;
    uNote();
  }
  textarea.value = '';
})


newBtn.addEventListener('click', () => { loadEditor() });

function uNote() {
  console.log(notes);

  const note = (id: string, v: string) => html`<a href="#" @click=${(e: Event) => {
    const elm = e.target as HTMLElement;
    e.preventDefault();
    if (!elm.matches('button'))
      loadEditor(id);
  }}
    >
      <p>${v}</p>
      <button @click=${() => {
      delete notes[id];
      uNote();
    }}>del</button>
    </a>`;

  render(noteList, html`${Object.entries(notes).map(([id, text]) => note(id, text))}`)
}

