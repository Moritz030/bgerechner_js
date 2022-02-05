const incomeValue = document.querySelector("#income-value");
const calculateBtn = document.querySelector("#calculate-btn");
const result = document.querySelector("#result");
const basicIncome = 1180.0;

calculateBtn.addEventListener('click', () => {
  result.innerText = nettoUtopia(incomeValue.value)
});

const bgeSozialabgaben = (income, independent = false) => {
  const li = [16, 8, 1]; // krank, rente, alos
  // krank = Kranken&Pflegeversicherung in einer gemeinsamen Buerger*innenversicherung
  independent ? percentage = 0.01 : percentage = 0.005;
  return li.map(val => val*percentage*income);
}

const bgeTaxes = (income) => {
  let sumTaxes = 0;
  if (income < 0) {
    return 0;
  }
  if (income > 0) {
    sumTaxes += Math.min(...[income, 24*basicIncome])*0.05;
  }
  if (income > 24*basicIncome) {
    sumTaxes += (Math.min(...[income, 48*basicIncome])-24*basicIncome)*0.15;
  }
  if (income > 48*basicIncome) {
    sumTaxes += (income-48*basicIncome)*0.24;
  }
  return sumTaxes;
}

const bgeTaxesAndBgeAbg = (income) => {
  return bgeTaxes(income) + 0.35*income;
}

const nettoUtopia = (income, independent = false) => {
  bgeSozial = bgeSozialabgaben(income, independent);
  taxesBGE = bgeTaxesAndBgeAbg(income);
  return income - taxesBGE - bgeSozial.reduce((val1,val2) => val1+val2) + basicIncome*12;
}
