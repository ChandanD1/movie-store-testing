const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Test Server OK'));
app.listen(5001, () => console.log('Test Server listening on 5001'));
