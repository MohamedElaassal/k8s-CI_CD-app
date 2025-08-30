const express = require('express');
const client = require('prom-client');
const app = express();

// Collect default metrics
client.collectDefaultMetrics();
app.get('/', (req, res) => {
res.send('Hello, Kubernetes CI/CD!');
});

app.get('/metrics', async (req, res) => {
res.set('Content-Type', client.register.contentType);
res.end(await client.register.metrics());
});

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
