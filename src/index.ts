import express from 'express';
import path from 'path';

import initializeRoutes from './api/index';

const app = express();

initializeRoutes(app);

app.use(express.static('public'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
