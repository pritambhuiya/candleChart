const http = require('http');
const fs = require('fs');

const { Style } = require('./style.js');
const { createCandle } = require('./candle.js');

const generateHtml = (tag, content, attr) =>
  `<${tag} ${attr}> ${content}</${tag}> `;

const generateGraph = (report) => {
  const style = new Style();
  const candleStats = { top: 500, height: 0, color: 'green' };

  const candles = report.map((candle) =>
    createCandle(candle, candleStats)).join('');

  style.addAttribute('display', 'flex');
  return generateHtml('div', candles, `style="${style.toHtml()}"`);
};

const generateReport = ({ hourly }) => {
  const { temperature_2m } = hourly;
  const temperature = [];

  temperature_2m.forEach((temp, index) => {
    temperature.push([temperature_2m[index - 1] || 15, temp]);
  });

  return temperature;
};

const storeResult = (data) => {
  const style = '<link rel="stylesheet" href="style.css">'
  const report = generateReport(JSON.parse(data));
  const graph = generateGraph(report);

  fs.writeFileSync('report.html', style + graph, 'utf8');
};

const main = (url) => {
  let data = '';
  http.get(url, (response) => {
    response.setEncoding('utf8');

    response.on('data', chunk => data += chunk);
    response.on('end', () => storeResult(data));
  });
};

const url = 'http://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m';

main(url);
