document.addEventListener("DOMContentLoaded", _ => flatpickr("#start-date", { dateFormat: "d-m-Y" })); // calendar init

import { collectedData } from "./dropAreas.js";

const form_UI = document.getElementsByTagName("form")[0];
const firstName_UI = document.getElementById("first-name");
const lastName_UI = document.getElementById("last-name");
const email_UI = document.getElementById("email");
const phone_UI = document.getElementById("phone");
const countrySelect_UI = document.getElementById("country");
const startDate_UI = document.getElementById("start-date");
const employmentStatusItems_UI = [...document.getElementsByName("employment-status-item")];
const ERROR_MESSAGES = {
	"First name": "Please enter at least 2 non-empty characters",
	"Last name": "Please enter at least 2 non-empty characters",
	"Email address": "Please enter a valid email address",
	"Phone number": "Please enter a valid phone number",
};

form_UI.addEventListener("submit", validateForm);

function validateForm(e) {
	e.preventDefault();

	let validationErrorsN = 0;
	validationErrorsN += validateAndAddListener(firstName_UI, "First name");
	validationErrorsN += validateAndAddListener(lastName_UI, "Last name");
	validationErrorsN += validateAndAddListener(email_UI, "Email address");
	validationErrorsN += validateAndAddListener(phone_UI, "Phone number");
	validationErrorsN += validateAndAddListener(countrySelect_UI, "Country name");
	validationErrorsN += validateAndAddListener(startDate_UI, "Start date");
	validationErrorsN += isEmploymentStatusSelected();
	validationErrorsN += collectedData["Resume"].length ? 0 : 1;

	onValidationResults(validationErrorsN);
}

function validateAndAddListener(field_UI, fieldName) {
	field_UI.removeEventListener("input", validateField);
	field_UI.addEventListener("input", () => validateField(field_UI, fieldName));

	return validateField(field_UI, fieldName);
}

function validateField(field_UI, fieldName) {
	const trimmedVal = field_UI.value.trim();

	if (field_UI.validity.valueMissing || trimmedVal.length < 2 || !field_UI.validity.valid) {
		onFieldValidationError(field_UI, fieldName);
		return 1;
	} else {
		onFieldValidationSuccess(field_UI);
		return 0;
	}
}

function onFieldValidationError(field_UI, fieldName) {
	const parent_UI = field_UI.parentElement;
	const errorMessage_UI = parent_UI.lastElementChild;

	parent_UI.classList.add("error");
	if (field_UI.validity.valueMissing || !field_UI.value) {
		errorMessage_UI.textContent = `${fieldName} is required`;
	} else {
		errorMessage_UI.textContent = ERROR_MESSAGES[fieldName];
	}
}
function onFieldValidationSuccess(field_UI) {
	field_UI.parentElement.classList.remove("error");
}

function isEmploymentStatusSelected() {
	if (!employmentStatusItems_UI.some(a => a.checked)) {
		onEmploymentStatusError();
		return 1;
	}
	return 0;
}
function onEmploymentStatusError() {
	const parent_UI = document.getElementById("current-employment-status");
	parent_UI.classList.add("error");
	parent_UI.addEventListener("change", () => hideEmploymentStatusErrorMessage(parent_UI));
}
function hideEmploymentStatusErrorMessage(parent_UI) {
	parent_UI.classList.remove("error");
	parent_UI.removeEventListener("change", hideEmploymentStatusErrorMessage);
}

function onValidationResults(validationErrorsN) {
	if (!validationErrorsN) {
		// submitFormData();
		window.location.href = "success.html";
	} else {
		document.documentElement.scrollIntoView({ behavior: "smooth" });

		removeOptionalFileErrorStyling(document.getElementById("upload-other"));

		const requiredFilesValidationArguments = [[document.getElementById("upload-resume-msg"), collectedData, "Resume"]];
		checkRequiredFileInInterval(requiredFilesValidationArguments);
	}
}

function removeOptionalFileErrorStyling(uploadOptional_UI) {
	uploadOptional_UI.classList.remove("error");
}

function checkRequiredFileInInterval(requiredFilesValidationArguments) {
	setInterval(
		_ =>
			requiredFilesValidationArguments.forEach(([errorMessage_UI, file, fileName]) => {
				if (!file[fileName].length && window.getComputedStyle(errorMessage_UI).visibility === "hidden") {
					errorMessage_UI.textContent = `${fileName} is required`;
					errorMessage_UI.previousElementSibling.classList.add("error");
				}
			}),
		300
	);
}

async function submitFormData() {
	const formData = new FormData(form_UI);

	formData.append("resume", JSON.stringify(collectedData["Resume"][0]));
	if (collectedData["Other Testimonials"].length) {
		formData.append("otherTestimonials", JSON.stringify(collectedData["Other Testimonials"]));
	}

	try {
		const response = await fetch("someURL", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) throw new Error("Response was not ok");

		const data = await response.json();
		//... some success logic;
	} catch (error) {
		console.error(error);
		//... some error logic;
	}
}
