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

const calculateTop = (currentColor, currentHeight, { color, top, height }) => {
  const backToBackColors = color + currentColor;

  if (backToBackColors === 'greengreen') {
    return top - currentHeight;
  }

  if (backToBackColors === 'redred') {
    return top + height;
  }

  if (backToBackColors === 'redgreen') {
    return top + height - currentHeight;
  }

  return top;
};

const createCandle = ([previous, current], candleStats) => {
  const difference = (current - previous).toFixed(2);
  const height = Math.abs(difference) * 35;
  const color = difference > 0 ? 'green' : 'red';
  let top = calculateTop(color, height, candleStats);

  candleStats.top = top;
  candleStats.height = height;
  candleStats.color = color;

  const candle = drawCandle(height, top, color);
  return generateHtml('div', current, `style="${candle}"`);
};

module.exports = { createCandle };
