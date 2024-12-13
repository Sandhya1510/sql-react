// import { useState, useEffect } from "react";
// import axios from "axios";
// import './App.css';

// function App() {
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/employees") 
//       .then((response) => {
//         setEmployees(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching employees:", error);
//       });
//   }, []);

//   return (
//     <div>
//       <h1>Employee List</h1>
//       <table border="1" cellPadding="10" cellSpacing="0">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Position</th>
//             <th>Salary</th>
//             <th>DateOfJoining</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employees.map((employee) => (
//             <tr key={employee.ID}>
//               <td>{employee.ID}</td>
//               <td>{employee.Name}</td>
//               <td>{employee.Position}</td>
//               <td>{employee.Salary}</td>
//               <td>{employee.DateOfJoining}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;


import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
      setTableData(JSON.parse(savedData));
    }
  }, []);

  const handleFetchTable = () => {
    if (!selectedTable) {
      alert('Please select a table!');
      return;
    }

    axios
      .get(`http://localhost:5000/${selectedTable}`)
      .then(response => {
        setTableData(response.data);
        setError(null); 
        localStorage.setItem('tableData', JSON.stringify(response.data));
      })
      .catch(error => {
        console.error('Error fetching table data:', error);
        setError('Failed to fetch table data.');
      });
  };

  const handleClearData = () => {
    setTableData([]);
    setSelectedTable('');
    setError(null);
    localStorage.removeItem('tableData'); 
  };

  return (
    <div>
      <h1>Dynamic Table Viewer</h1>
      <div className="select-table">
        <label htmlFor="table-select">Select a Table:</label>
        <select
          id="table-select"
          value={selectedTable}
          onChange={e => setSelectedTable(e.target.value)}
        >
          <option value="">Choose Table</option>
          <option value="student">student</option>
          <option value="employees">Employees</option>
          <option value="company_projects">Company-Projects</option>
        </select>
        <button onClick={handleFetchTable}>Getdata</button>
        <button onClick={handleClearData} style={{  backgroundColor: 'red' }}>
          Clear 
        </button>
      </div>
      <h2>Table Data</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tableData.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((column, idx) => (
                <th key={idx}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
}

export default App;
