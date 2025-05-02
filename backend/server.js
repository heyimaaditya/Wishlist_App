require('dotenv').config(); // Load environment variables
const app = require('./src/app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});