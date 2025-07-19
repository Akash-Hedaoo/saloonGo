const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes"); // ✅ only this once

const app = express();
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

// ✅ Mount auth routes at /api/auth
app.use('/api/auth', authRoutes); 
// React can now send requests to:
// - POST /api/auth/signup/customer
// - POST /api/auth/signup/salonOwner

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
