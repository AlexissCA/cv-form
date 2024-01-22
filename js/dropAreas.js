const REG_EXPS = {
	textFile: new RegExp("\\.(pdf)|(docx?)|(xlsx?)|(pptx?)$"),
};
const resume = {
	name: "resume",
	area_UI: document.getElementById("upload-resume"),
	input_UI: document.getElementById("upload-resume-input"),
	errorMessage_UI: document.getElementById("upload-resume-msg"),
	errorMessage: "Please attach the correct resume file as specified above",
	dataSizeLimit: 3145728,
	dataAmountLimit: 1,
	dataFormatRegExp: REG_EXPS.textFile,
	data: [],
};
const otherTestimonials = {
	name: "otherTestimonials",
	area_UI: document.getElementById("upload-other"),
	input_UI: document.getElementById("upload-other-input"),
	errorMessage_UI: document.getElementById("upload-other-msg"),
	errorMessage: "Please attach correct files as specified above",
	dataSizeLimit: 15728640,
	dataAmountLimit: 5,
	dataFormatRegExp: REG_EXPS.textFile,
	data: [],
};
export const collectedData = {
	"Resume": resume.data,
	"Other Testimonials": otherTestimonials.data,
};

dropAreaInit(resume);
dropAreaInit(otherTestimonials);

function dropAreaInit(file) {
	dragoverHandler(file);
	dragleaveHandler(file);
	clickHandler(file);
	dropHandler(file);

	dropAreaInputInit(file);
}

function dragoverHandler(file) {
	file.area_UI.addEventListener("dragover", e => {
		e.preventDefault();
		file.area_UI.classList.add("droparea-active");
	});
}

function dragleaveHandler(file) {
	file.area_UI.addEventListener("dragleave", _ => file.area_UI.classList.remove("droparea-active"));
}

function clickHandler(file) {
	file.area_UI.addEventListener("click", _ => file.input_UI.click());
}

function dropHandler(file) {
	file.area_UI.addEventListener("drop", e => {
		e.preventDefault();
		file.area_UI.classList.remove("droparea-active");
		validateData(e.dataTransfer.files, file);
	});
}

function dropAreaInputInit(file) {
	file.input_UI.addEventListener("change", e => validateData(e.target.files, file));
}

function validateData(data, file) {
	if (data.length && data.length <= file.dataAmountLimit) {
		let totalSize = 0;
		let correctDataFormat = true;
		for (let d of data) {
			totalSize += d.size;
			if (!isCorrectDataFormat(d, file)) {
				correctDataFormat = false;
				break;
			}
		}

		if (isWithinSizeLimit(totalSize, file) && correctDataFormat) {
			onDataValidationSuccess(data, file);
		} else {
			onDataValidationError(file);
		}
	} else if (data.length) {
		onDataValidationError(file);
	}
	file.input_UI.value = ""; // to be able to load same file twice
}

function onDataValidationSuccess(data, file) {
	file.area_UI.classList.remove("error");
	addDataToArr(data, file);
	createFilesListElement(file);
}

function onDataValidationError(file) {
	removeFileListElement(file);
	file.data.length = 0;
	file.area_UI.classList.add("error");
	file.errorMessage_UI.textContent = file.errorMessage;
}

function createFilesListElement(file) {
	removeFileListElement(file);

	if (file.data.length) {
		const filesList_UI = document.createElement("ul");
		filesList_UI.className = "added-files";
		let id = 0;

		for (let data of file.data) {
			const row_UI = createRowElement(id, file);
			const fileName_UI = createFileNameElement(data);
			const deleteIcon_UI = createDeleteIconElement();

			row_UI.appendChild(fileName_UI);
			row_UI.appendChild(deleteIcon_UI);
			filesList_UI.appendChild(row_UI);

			id++;
		}

		filesList_UI.addEventListener("click", e => onFileElementRemoval(e, file));
		file.errorMessage_UI.insertAdjacentElement("afterend", filesList_UI);
	}
}

function createRowElement(id, file) {
	const row_UI = document.createElement("div");
	row_UI.className = "row";
	row_UI.setAttribute("id", `${file.name} + ${id}`);
	return row_UI;
}

function createFileNameElement(data) {
	const fileName_UI = document.createElement("li");
	fileName_UI.className = "file-name";
	fileName_UI.textContent = shortenDataName(data);
	return fileName_UI;
}

function createDeleteIconElement() {
	const deleteIcon_UI = document.createElement("i");
	deleteIcon_UI.className = "fa-solid fa-xmark";
	return deleteIcon_UI;
}

function removeFileListElement(file) {
	const errorMessageSibling_UI = file.errorMessage_UI.nextElementSibling;
	if (errorMessageSibling_UI && errorMessageSibling_UI.classList.contains("added-files")) {
		errorMessageSibling_UI.remove();
	}
}

function onFileElementRemoval(e, file) {
	if (e.target.classList.contains("fa-xmark")) {
		const id = +e.target.parentElement.id.replace(/[^\d]+/g, "");
		removeDataFromArr(id, file);
		createFilesListElement(file);
	}
}

function addDataToArr(data, file) {
	for (let d of data) file.data.push(d);
	const latest = file.data.slice(-file.dataAmountLimit);
	file.data.length = 0;
	let i = 0;
	while (latest[i]) file.data.push(latest[i++]);
}

function removeDataFromArr(id, file) {
	const filtered = file.data.filter((_, i) => i !== id);
	file.data.length = 0;
	let i = 0;
	while (filtered[i]) file.data.push(filtered[i++]);
}

function isCorrectDataFormat(data, file) {
	return file.dataFormatRegExp.test(data.name);
}

function isWithinSizeLimit(size, file) {
	return size <= file.dataSizeLimit;
}

function shortenDataName(data) {
	return data.name.length >= 40 ? data.name.slice(0, 34) + ".." + data.name.slice(data.name.lastIndexOf(".")) : data.name;
}
