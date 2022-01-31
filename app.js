// Imports
import Chart from "chart.js/auto";

// Websocket connection
let ws = new WebSocket('wss://stream.binance.com:9443/ws/etheur@trade');

// Containers
let orignal = document.querySelector('.orignal');
let predicted = document.querySelector('.predicted');
let indicator = document.querySelector('.indicator');

// Last price
let lastPrice = 0;

// Websocket response on every message/change
ws.onmessage = function(event) {
    let data = JSON.parse(event.data);
    orignal.innerText = '$' + `${parseFloat(data.p).toFixed(2)}`;
    orignal.style.color = data.p > lastPrice ? 'green' : 'red';
    predicted.innerText = '$' + `${parseFloat(data.p).toFixed(2)}`;
    predicted.style.color = data.p > lastPrice ? 'green' : 'red';
    indicator.style.background = data.p > lastPrice ? 'green' : 'red';
    addData(data.p);
    lastPrice = data.p;
}


// Chart JS
const ctx = document.getElementById("myChart").getContext("2d");

// Config Variables
var numberElements = 100;

// Globals
var updateCount = 0;

// myChart
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "ETH/EUR",
        data: 0,
        fill: false,
        borderColor: "rgba(255, 0, 0, 1)"
        ,
        borderWidth: 1,
      },
    ],
  },
  options: {
      scales: {
          y: {
                ticks: {
                    callback: function (value, index, values) {
                        return '$' + value.toFixed(2);
                    }
                }
          }
      }
  }
});

// Add data to chart
function addData(data) {
    if(data) {
        let t = new Date();
        t =
          t.getHours() +
          ":" +
          t.getMinutes() +
          ":" +
          t.getSeconds();
          
        myChart.data.labels.push(t);
        myChart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        })

        if(updateCount > numberElements) {
            myChart.data.labels.shift();
            myChart.data.datasets[0].data.shift();
        } else {
            updateCount++;
        }

        myChart.update();

    }
}

// Menu Bar

const links = document.querySelectorAll('.link');
const sections = document.querySelectorAll('.section');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        links.forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');

        sections.forEach(section => {
            section.classList.remove('active');
        })
        
        let currSection = document.querySelector(
          `.${e.target.attributes.data.value}`
        );
        currSection.classList.add('active');

    })
})