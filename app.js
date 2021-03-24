const http = require('http');

const express = require('express');

const path = require('path');

const hbs = require('hbs');

const app = express();

const hostname = '127.0.0.1';

const bodyParser = require('body-parser');

const port = 3000;

const mysql = require('mysql');
const { isBuffer } = require('util');

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'demo'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySql Connected...');
});

//insert
app.get('/users/create', (req, res) => {
    res.render('users/create');
});

app.post('/users/create', (req, res) => {
    let name = req.body.name;
    let data = { name: name, email: req.body.email };
    let sql = "INSERT INTO demo.users SET ?";
    let query = db.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/users');
    });
});

app.get('/users', (req, res) => {
    let sql = "SELECT * FROM users";
    let query = db.query(sql, (err, users) => {
        if (err) throw err;
        res.render('users/index', {
            users: users
        });
    });
});

//delete
app.get("/delete/:id", function (req, res) {
    db.query(`DELETE FROM users WHERE id =${req.params.id}`, function (err) {
        if (err) throw err;
        res.redirect("/users");// / => views  // => views/users
    })
});

//edit
app.get('/users/edit/:id', function (req, res) {
    let id = req.params.id;
    let sql = `SELECT * FROM users WHERE id = "${id}"`;
    db.query(sql, (err, row) => {
        if (err) throw err;
        res.render('users/edit', {
            title: 'Sửa thông tin',
            users: row[0]
        })
    })
})

//update
app.post('/users/edit/:id', function (req, res) {
    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let sql = `UPDATE users SET name ="${name}", email="${email}" WHERE id ="${id}"`;
    db.query(sql, (err) => {
        if (err) throw err;
        console.log(`Sửa thành công người dùng: ${name}`);
        res.redirect('/users');
    });
})

// app.get('/', (req, res) => {
//     res.render('index', {
//         name: "M Firki"
//     });
// });
// app.get('/post', (req, res) => {
//     res.render('form');
// });
// app.post('/post', (req, res) => {
//     res.render('index', {
//         name: req.body.textname
//     });
// });
// app.get('/:name', (req, res) => {
//     res.render('index', {
//         name: req.params.name
//     });
// });

// // app.get('/home', function (req, res) {
// //     res.send('Welcome to Express');
// // });
// // app.get('/about', function (req, res) {
// //     res.send('this is about page ');
// // });
app.listen(port, hostname, () => {
    console.log(`Server running at http:${hostname} : ${port}/`);
});