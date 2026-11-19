const express = require("express");

const app = express();
app.use(express.json());

// Memory storage
let students = [];
let nextId = 1;

/*
POST /api/students
*/
app.post("/api/students", (req, res) => {
  const { name, course, age } = req.body;

  if (!name || !course || age === undefined) {
    return res.status(400).json({
      message: "Missing data"
    });
  }

  const duplicate = students.find(
    student => student.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    return res.status(409).json({
      message: "Student already exists"
    });
  }

  const newStudent = {
    id: nextId++,
    name,
    course,
    age
  };

  students.push(newStudent);

  res.status(201).json(newStudent);
});

/*
GET ALL + FILTER
*/
app.get("/api/students", (req, res) => {
  const { course } = req.query;

  if (course) {
    const filtered = students.filter(
      s => s.course.toLowerCase() === course.toLowerCase()
    );

    return res.status(200).json(filtered);
  }

  res.status(200).json(students);
});

/*
GET BY ID
*/
app.get("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({
      message: "Wrong ID"
    });
  }

  res.status(200).json(student);
});

/*
UPDATE
*/
app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({
      message: "Wrong ID"
    });
  }

  const { name, course, age } = req.body;

  if (!name || !course || age === undefined) {
    return res.status(400).json({
      message: "Missing data"
    });
  }

  student.name = name;
  student.course = course;
  student.age = age;

  res.status(200).json(student);
});

/*
DELETE
*/
app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Wrong ID"
    });
  }

  students.splice(index, 1);

  res.status(200).json({
    message: "Student deleted"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});