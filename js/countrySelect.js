document.addEventListener("DOMContentLoaded", populateCountrySelect);

const countrySelect_UI = document.getElementById("country");

async function populateCountrySelect() {
	const response = await fetch("data/countries.json");
	const countriesData = await response.json();
	countrySelect_UI.innerHTML = countriesData.map(({ country }) => `<option value="${country}">${country}</option>`).join("");
}
