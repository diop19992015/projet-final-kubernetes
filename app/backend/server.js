const express = require('express');

const app = express();
const port = process.env.PORT;

app.use(express.json());

if (!port) {
  throw new Error('La variable d environnement PORT est obligatoire.');
}

app.get('/api/hello', (req, res) => {
  try {
    res.status(200).json({
      endpoint: 'hello',
      message: 'Bonjour depuis le backend Kubernetes.',
      data: [
        { id: 1, name: 'Commande A', status: 'prete' },
        { id: 2, name: 'Commande B', status: 'en cours' },
        { id: 3, name: 'Commande C', status: 'livree' }
      ]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur lors du traitement de /api/hello'
    });
  }
});

app.get('/api/items', (req, res) => {
  try {
    res.status(200).json({
      endpoint: 'items',
      message: 'Liste des items renvoyee par le backend.',
      data: [
        { id: 101, label: 'Item Alpha', quantity: 12 },
        { id: 102, label: 'Item Beta', quantity: 7 },
        { id: 103, label: 'Item Gamma', quantity: 21 }
      ]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur lors du traitement de /api/items'
    });
  }
});

app.get('/api/health', (req, res) => {
  try {
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur lors du health check'
    });
  }
});

app.get('/health', (req, res) => {
  try {
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur lors du health check'
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(port, () => {
  console.log(`Backend demarre sur le port ${port}`);
});
