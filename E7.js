const port = process.env.PORT || 3000;
const host = '0.0.0.0';
const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { validate } = require('joi/lib/types/object');
const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.json());

app.listen(port, host, () =>{
    console.log(`Port ${port} started.......`);
  });
;

const courses = [
    { id: 1, name: 'course1', code: 'CSE499' },
    { id: 2, name: 'course2', code: 'CSE412' },
    { id: 3, name: 'course3', code: 'CSE465' }
];
const students = [
    { id: 1, name: 'Omar Abdel-Baset', code: '1600888' },
    { id: 2, name: 'Ibrahim Hasan', code: '1600008' },
    { id: 3, name: 'Omar Abdel-Aziz', code: '1600885' },
    { id: 4, name: 'Khaled Atef', code: '1600445' }
];

app.get('/web/students/create',(req, res) => {
    res.sendFile(path.join(__dirname+'/students.html'));
});


app.get('/web/courses/create',(req, res) => {
    res.sendFile(path.join(__dirname+'/courses.html'));
});


app.get('/api/courses', (req, res) => {
    res.send(courses);
});
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id was not found.');
    res.send(course);
});


app.get('/api/students', (req, res) => {
    res.send(students);
});
app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('The student with the given id was not found.');
    res.send(student);
});



app.post('/api/courses', (req, res) => {
    // validate request
    const schema = {
        name: Joi.string().min(5).required(),
        code: Joi.string().min(6).required(),
        description: Joi.string().max(200)
    }

    const result = Joi.validate(req.body, schema);
    //console.log(result);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // create a new course object
    const course = {
        id: courses.length + 1,
        name: req.body.name, // assuming that request body there's a name property
        code: req.body.code,
        description: req.body.description
    };
    courses.push(course);
    res.send(course);
});

app.post('/api/students', (req, res) => {
    const schema = {
        name: Joi.string().required(),
        code: Joi.string().min(7).required()
    }

    const result = Joi.validate(req.body, schema);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const student = {
        id: students.length + 1,
        name: req.body.name,
        code: req.body.code
    };
    students.push(student);
    res.send(student);
});

// Updating resources
app.put('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id was not found.');

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);

    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('The student with the given id was not found.');

    const { error } = validateStudent(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);
});

// Deleting a course
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('THe course with the given id was not found.');
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});

app.delete('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('The student with the given id was not found.');
    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);

    // Return the same course
    res.send(student);
});


/*const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listeneing on port ${port}......`));*/

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(/^[a-zA-Z]{3}\d{3}$/).required(),
        description: Joi.string().max(200)
    }
    return Joi.validate(course, schema);
}

function validateStudent(student) {
    const schema = {
        name: Joi.string().regex(/^([a-zA-Z-']*)$/).required(),
        code: Joi.string().length(7).required()
    }
    return Joi.validate(student, schema);
}
