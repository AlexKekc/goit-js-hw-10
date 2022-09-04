import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');

const refs = {
  inputForm: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

let searchQuery = '';

function onSearch(event) {
  clearCountryList();
  clearCountryInfo();

  const inputValue = event.target.value.trim();

  if (inputValue === '') {
    return;
  }

  searchQuery = inputValue;

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
      } else if (countries.length === 1) {
        renderCountryInfo(countries);
      }
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
        <li>
          <p><img src=${country.flags.svg} alt=${country.name.official}>${country.name.official}</p>
        </li>
        `;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfo(countries) {
  const markup = countries.map(country => {
    return `
          <h1><img src=${country.flags.svg} alt=${country.name.official}><b>${
      country.name.official
    }</b></h1>
          <p><b>Capital</b>: ${country.capital}</p>
          <p><b>Population</b>: ${country.population}</p>
          <p><b>Languages</b>: ${Object.values(country.languages).join(
            ', '
          )}</p>
          `;
  });

  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
