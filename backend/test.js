
const express = require('express');
const app = express();
app.listen(5000, () => {
  console.log("✅ Test server running on port 5000!");
});

// Add a simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test success!' });
});
