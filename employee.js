
const fs = require("fs");

// Read employees from JSON file
const data = fs.readFileSync("employees.json", "utf8");
const employees = JSON.parse(data);

// Display existing employees
console.log("Existing Employees:");
console.log(employees);

// Add a new employee
const newEmployee = {
    id: 6,
    name: "Usman",
    department: "IT"
};

employees.push(newEmployee);

// Save updated data back to JSON file
fs.writeFileSync(
    "employees.json",
    JSON.stringify(employees, null, 2),
    "utf8"
);

console.log("New employee added successfully!");
console.log("Total Employees:", employees.length);
