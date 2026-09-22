document.addEventListener('DOMContentLoaded', () => {
  const visualizerContainer = document.getElementById('visualizer-container');
  const generateBtn = document.getElementById('generate-btn');
  const arraySizeInput = document.getElementById('array-size');
  const sizeVal = document.getElementById('size-val');

  let currentArray = [];

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateArray(size = 30) {
    currentArray = [];   // Clears old bars from screen
    visualizerContainer.innerHTML = '';

    for (let i = 0; i < size; i++) {
      const value = getRandomInt(15, 95);
      currentArray.push(value);

      const bar = document.createElement('div');
      bar.classList.add('bar');
      bar.style.height = `${value}%`;
      
      visualizerContainer.appendChild(bar);
    }
  }

  // Event Listeners
  generateBtn.addEventListener('click', () => {
    generateArray(arraySizeInput.value);
  });

  arraySizeInput.addEventListener('input', (e) => {
    sizeVal.innerText = e.target.value;
    generateArray(e.target.value);
  });

  // Initial load
  generateArray(arraySizeInput.value);
});