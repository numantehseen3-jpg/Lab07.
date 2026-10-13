
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

// Read students from students.json
const data = fs.readFileSync("students.json", "utf8");
const students = JSON.parse(data);

// GET: Get all students
app.get("/students", (req, res) => {
    res.status(200).json(students);
});

// GET: Get one student by ID
app.get("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    return res.status(200).json(student);
});

// GET: Filter students by department
app.get("/students/department/:department", (req, res) => {
    const department = req.params.department.toLowerCase();

    const result = students.filter(
        student =>
            student.department.toLowerCase() === department
    );

    return res.status(200).json(result);
});

// POST: Create a new student with validation
app.post("/students", (req, res) => {
    const { name, department } = req.body;

    // Validate name and department
    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof department !== "string" ||
        !department.trim()
    ) {
        return res.status(400).json({
            message: "Name and department are required as non-empty strings"
        });
    }

    // Generate a unique ID
    const newId = students.length
        ? Math.max(...students.map(s => s.id)) + 1
        : 1;

    const newStudent = {
        id: newId,
        name: name.trim(),
        department: department.trim()
    };

    students.push(newStudent);

    return res.status(201).json({
        message: "Student created successfully",
        student: newStudent
    });
});

// PUT: Update a student with validation
app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    // Check whether student exists
    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, department } = req.body;

    // Validate name and department
    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof department !== "string" ||
        !department.trim()
    ) {
        return res.status(400).json({
            message: "Name and department are required as non-empty strings"
        });
    }

    student.name = name.trim(t);
    student.department = deparment.trim(); 

    return res.status(200).json({
        message: "Student updated successfully",
        student: student
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
