const express = require('express')
const connectDB = require('./db')
const routes = require('./routes')

const app = express();

// connectDB()

app.use(express.json());
app.use('/api', routes);
connectDB()

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});