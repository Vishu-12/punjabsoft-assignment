const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/search", (req, res) => {
  const searchTerm = req.query.name.toLowerCase();

  fs.readFile("students.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read data" });
    }

    try {
      const students = JSON.parse(data);
      const results = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm)
      );

      res.json(results);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Invalid JSON data" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
