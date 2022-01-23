const inputTel = document.getElementById("tel");

inputTel.addEventListener("input", (e) => {
  e.target.value = telMask(e.target.value);
});

const telMask = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{1})/, "$1")
    .replace(/(\d{1})(\d{4})(\d{4})/, "$1 $2-$3");
};