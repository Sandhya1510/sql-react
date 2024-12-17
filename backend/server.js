// const express = require('express');
// const mysql = require('mysql2'); // Use mysql2 for better compatibility
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // MySQL Database Connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Daddy@123', 
//   database: 'companyDB',
//   port: 3306 // MySQL default port
// });
 
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//   } else {
//     console.log('Connected to the database.');
//   }
// });


// app.get('/api/employees', (req, res) => {
//   const sql = 'SELECT * FROM Employees'; 
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).send('Error fetching data');
//     } else {
//       res.json(results);
//     }
//   });
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/api/employees`);
// });





// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mysql = require('mysql2');


// const app = express();
// app.use(cors());
// app.use(express.json());

// // Database configuration
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '', 
//   database: 'companyDB',
//   port: 3306, 
//   multipleStatements: false,
// });

// // Connect to the database
// db.connect(err => {
//   if (err) {
//     console.error('Database connection failed:', err.message);
//   } else {
//     console.log('Database connected successfully.');
//   }
// });

// // Fetch data from a selected table
// app.get('/:tableName', (req, res) => {
//   const tableName = req.params.tableName.toLowerCase();
//   const allowedTables = ['student', 'employees', 'company_projects']; 

//   // Validate table name to prevent SQL injection
//   if (!allowedTables.includes(tableName)) {
//     return res.status(400).json({ error: 'Invalid table name' });
//   }

//   const query = `SELECT * FROM ??`;
//   db.query(query, [tableName], (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err.message);
//       return res.status(500).json({ error: 'Failed to fetch data' });
//     }
//     res.json(results);
//   });
// });

// // Error handler for uncaught exceptions
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({ error: 'An internal server error occurred.' });
// });

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'companyDB',
  port: 3306,
  multipleStatements: false,
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected successfully.');
  }
});


const allowedTables = ['student', 'employees', 'company_projects'];

// Fetch all data from a selected table (GET)
app.get('/:tableName', (req, res) => {
  const tableName = req.params.tableName.toLowerCase();

  if (!allowedTables.includes(tableName)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  const query = `SELECT * FROM ??`;
  db.query(query, [tableName], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    res.json(results);
  });
});

// Insert new data into a table (POST)
app.post('/:tableName', (req, res) => {
  const tableName = req.params.tableName.toLowerCase();

  if (!allowedTables.includes(tableName)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  const data = req.body;
  delete data.ID;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  const query = `INSERT INTO ?? SET ?`;
  db.query(query, [tableName, data], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err.message);
      return res.status(500).json({ error: 'Failed to insert data', details: err.message });
    }
    res.json({ message: 'Data inserted successfully', id: result.insertId });
  });
});

// Update existing data in a table (PUT)
app.put('/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName.toLowerCase();
  const id = req.params.id;
  const data = req.body;

  if (!allowedTables.includes(tableName)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  // Ensure there is data to update
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  const query = `UPDATE ?? SET ? WHERE ID = ?`;
  db.query(query, [tableName, data, id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err.message);
      return res.status(500).json({ error: 'Failed to update data', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No record found with the given ID' });
    }
    res.json({ message: 'Data updated successfully' });
  });
});

// Delete data from a table (DELETE)
app.delete('/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName.toLowerCase();
  const id = req.params.id;

  if (!allowedTables.includes(tableName)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  const query = `DELETE FROM ?? WHERE id = ?`;
  db.query(query, [tableName, id], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err.message);
      return res.status(500).json({ error: 'Failed to delete data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Data deleted successfully' });
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
