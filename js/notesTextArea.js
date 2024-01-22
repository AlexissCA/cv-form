const notes_UI = document.getElementById("notes");
const notesInitialHeight = getComputedStyle(notes).getPropertyValue("height").slice(0, -2);

notes_UI.addEventListener("input", notesTextAreaAutoHeight);

function notesTextAreaAutoHeight() {
	notes_UI.style.height = notesInitialHeight + "px"; // for browser "reset"
	notes_UI.style.height = Math.max(notesInitialHeight, notes_UI.scrollHeight) + "px";
}
