const resultElement = document.getElementById('result');
const helloButton = document.getElementById('hello-button');
const itemsButton = document.getElementById('items-button');
const healthButton = document.getElementById('health-button');

async function loadJson(endpoint) {
  resultElement.textContent = 'Appel en cours...';

  try {
    const response = await fetch(`/api/${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    resultElement.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    resultElement.textContent = `Impossible de contacter le backend: ${error.message}`;
  }
}

helloButton.addEventListener('click', () => loadJson('hello'));
itemsButton.addEventListener('click', () => loadJson('items'));
healthButton.addEventListener('click', () => loadJson('health'));
