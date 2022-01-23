const form = document.getElementById("form");
const stateList = document.getElementById("stateList");
const cityList = document.getElementById("cityList");
const inputState = document.getElementById("state");
const inputCity = document.getElementById("city");
let timeAlert = null;
let success = true;
const baseURL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"

inputState.addEventListener("change", (e) => {
  const item = stateList.childNodes;
  e.target.value = e.target.value.toUpperCase();
  item.forEach(async ({ value, id }) => {
    if (value === e.target.value) {
      const citys = await getCitys(id);
      setCitysInDataList(citys);
      inputCity.removeAttribute("disabled");
      inputCity.addEventListener("focusout", (e) => {
        if (!validadeCity(inputCity, citys))
          printErrorInput(inputCity, "Este campo está inválido");
      });
    }
  });
});
(async function getStates() {
  await fetch(baseURL)
    .then((res) => res.json())
    .then((res) =>
      res.map(({ id, sigla, nome }) => {
        const option = document.createElement("option");
        option.setAttribute("id", id);
        option.setAttribute("value", sigla);
        option.innerText = nome;
        stateList.appendChild(option);
      })
    );
})();
async function getCitys(id) {
  cityList.innerHTML = "";
  return await fetch(
    `${baseURL}/${id}/municipios`
  ).then((res) => res.json());
}
function setCitysInDataList(citys) {
  citys.map(({ id, nome }) => {
    const option = document.createElement("option");
    option.setAttribute("id", id);
    option.setAttribute("value", nome);
    cityList.appendChild(option);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  for (const element of e.target) {
    validateInputs(element);
  }
  if (success) {
    allertClassToogle("alert-disabled", "alert-open");
    timeAlert = window.setTimeout(() => {
      allertClassToogle("alert-disabled", "alert-open");
    }, 5000);
    clearInputValue(e.target);
  }
});

function allertClassToogle(...nClass) {
  nClass.map((item) => {
    document.getElementById("alert").classList.toggle(item);
  });
}

function closeAlert() {
  timeAlert && window.clearTimeout(timeAlert);
  allertClassToogle("alert-disabled", "alert-open");
}

function validateInputs(element) {
  if (element.id !== "message" && element.id !== "newsLater") {
    const emailIsValid =
      element.id === "email" ? validadeEmail(element.value) : true;
    if (
      element.value.trim() === "" ||
      (element.id === "terms" && !element.checked) ||
      !emailIsValid
    ) {
      printErrorInput(element, "Este campo é obrigatório");
      return false;
    }
  }
  return true;
}

function validadeEmail(email) {
  const reg = /\S+@\S+\.\S+/;
  if (!reg.test(email)) {
    return false;
  }
  return true;
}

function validadeCity(element, array) {
  const contain = array.filter(({ nome }) => {
    return nome.toUpperCase() === element.value.toUpperCase();
  });
  if (contain.length !== 1) return false;
  return true;
}

function clearInputValue(elements) {
  for (const item of elements) {
    if (item.type === "checkbox") item.checked = false;
    else if (item.type !== "submit") {
      if (item.id === "city") item.disabled = true;
      item.value = "";
    }
  }
}

function printErrorInput(element, message) {
  let displayErrorMessage = document.getElementById(
    `erroMessage-${element.id}`
  );
  displayErrorMessage.style.display = "block";
  displayErrorMessage.innerText = message;
  success = false;
  element.addEventListener("focusin", () => {
    success = true;
    displayErrorMessage.style.display = "none";
  });
}
