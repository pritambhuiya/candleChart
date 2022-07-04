const http = require('http');
const fs = require('fs');

const { Style } = require('./style.js');

const generateHtml = (tag, content, attr) =>
  `<${tag} ${attr}> ${content}</${tag}> `;

const drawCandle = (height, top, color) => {
  const style = new Style();

  style.addAttribute('width', '100px');
  style.addAttribute('height', height);
  style.addAttribute('margin', 0);

  style.addAttribute('position', 'relative');
  style.addAttribute('top', top + 'px');
  style.addAttribute('background-color', color);

  return style.toHtml();
};

let prevTop = 500;
let prevHeight = 0;
let prevColor = 'green';

const createCandle = ([previous, current]) => {
  const difference = (current - previous).toFixed(2);
  const height = Math.abs(difference) * 35;
  const color = difference > 0 ? 'green' : 'red';
  let top = calculateTop(color, height);

  prevColor = color;
  prevTop = top;
  prevHeight = height;

  const candle = drawCandle(height, top, color);
  return generateHtml('div', current, `style="${candle}"`);
};

const calculateTop = (color, height) => {
  if ((prevColor + color) === 'greengreen') {
    return prevTop - height;
  }

  if ((prevColor + color) === 'redred') {
    return prevTop + prevHeight;
  }

  if ((prevColor + color) === 'redgreen') {
    return prevTop + prevHeight - height;
  }

  if ((prevColor + color) === 'greenred') {
    return prevTop;
  }
};

const generateGraph = (report) => {
  const candles = report.map(createCandle).join('');
  const style = new Style();

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
