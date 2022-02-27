const incomeValue = document.querySelector("#income-value");
const calculateBtn = document.querySelector("#calculate-btn");
const tabelle = document.querySelector("#tabelle");
const chartHeader = document.querySelector("#chartheader");
const result = document.querySelector("#result");
const mitmachen = document.querySelector("#mitmachen");
const basicIncome = 1180.0;

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


// here starts the chart part:

const labels = [
  'Netto-Monatseinkommen', 'Steuern & BGE-Abgabe', 'Krankenversicherung', 'Rentenversicherung', 'Arbeitslosenversicherung'
];

let data = {
  datasets: [{
    label: 'BGE',
    backgroundColor: ['rgb(58, 175, 88)', 'rgb(102, 0, 2)', 'rgb(129, 10, 13)', 'rgb(239, 33, 38)', 'rgb(255, 102, 106)'],
    data: [],
  }]
};

let config = {
  type: 'pie',
  data: data,
  options: {
    plugins: {
      title: {
        display: false,
        text: 'Details'
      },
      legend: {
        position: 'top',
      },
    },
    responsive: true
  }
};

const myChart = new Chart(
  document.getElementById('myChart'),
  config
);

const updateChart = () => {
  result.innerHTML = 'Netto-Monatseinkommen (inklusive ' + basicIncome + ' Euro BGE): <br><div style="width: 136px; text-align: center; border-radius:8px; background-color: rgb(116,4,4);">' + (nettoUtopia(incomeValue.value*12)/12).toFixed(2) + ' Euro</div>';

  let data = {
    labels: labels,
    datasets: [{
      label: 'BGE',
      backgroundColor: ['rgb(58, 175, 88)', 'rgb(102, 0, 2)', 'rgb(129, 10, 13)', 'rgb(239, 33, 38)', 'rgb(255, 102, 106)'],
      data: [nettoUtopia(incomeValue.value*12)/12, bgeTaxesAndBgeAbg(incomeValue.value*12)/12, bgeSozialabgaben(incomeValue.value*12, independent = false)[0]/12, bgeSozialabgaben(incomeValue.value*12, independent = false)[1]/12, bgeSozialabgaben(incomeValue.value*12, independent = false)[2]/12],
    }]
  };
  myChart.config.options.plugins.title.display = true;
  myChart.data = data;
  myChart.update();
}

calculateBtn.addEventListener('click', () => {
  updateChart();
  tabelle.innerHTML = '<p><a class="link-light" data-bs-toggle="collapse" href="#collapse1" role="button" aria-expanded="true" >Nettoeinkommen (Single) mit und ohne BGE (in Euro) </a> <div class="collapse show" style="padding:12px; border:1px solid black;" id="collapse1"><p style="font-size: 14px; margin-bottom:0px;">Das in der Tabelle herangezogene Nettoeinkommen basiert auf den 2017 gültigen Einkommensteuersätzen und Sozialversicherungsbeiträgen. Für dieses und weitere Beispiele siehe die <a href="https://www.die-linke-grundeinkommen.de/fileadmin/lcmsbaggrundeinkommen/user/upload/BGE_druck.pdf" class="link-light"> Broschüre der BAG Grundeinkommen. </a></p><br><img src="./img/tabelle.png" class="img-fluid"></img><br></div> '
  chartHeader.innerText = 'Nettoeinkommen & Abgaben';
  mitmachen.innerHTML= '<div style="margin-top:48px;"><p><a class="link-light" style="padding:8px 16px 8px 16px; border-radius:8px; background-color: rgb(116,4,4);" href="https://www.mit-links-zum-grundeinkommen.de/">DIE LINKE & BGE: Mitmachen beim Mitgliederentscheid</a></p></div>';
});



