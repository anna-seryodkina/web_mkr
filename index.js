var jwt = require('jsonwebtoken');
const app = require('express')();
const PORT = 3001;
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/students.db');
let sql;


app.use(bodyParser.json())


app.get('/', function(req, res){
    res.send('welcome.');
  })


app.get('/students', (req, res) => {
    sql = "SELECT * FROM students";
    try {
        db.all(sql, [], (err, rows) => {
            if(err) return res.json({status: 300,  success: false, error: err});

            if(rows.length < 1) return res.json({status: 300,  success: false, error: "no match"});

            return res.json({ status: 200, data: rows, success: true });
        })
    } catch (error) {
        return res.json({
            status: 400,
            success: false
        });
    }
});


app.get('/:nickname', (req, res) => {
    const {nickname} = req.params.nickname;
    sql = "SELECT * FROM students WHERE nickname LIKE '%${nickname}%'";
    db.run(sql, [nickname], (err)=>{
        if(err) return res.json({status: 300,  success: false, error: err});

        var token = jwt.sign({'nickname': nickname}, 'supersecret');
        return res.json({status: 200,  success: true, 'nickname': req.params.nickname, 'token': token});
    })
});


app.post('/:nickname', (req, res) => {
    var token = jwt.sign({'nickname': req.params.nickname}, 'supersecret');
    jwt.verify(token, 'supersecret', function(err, decoded){
        if(!err){
            // add to DB
            const {nickname, firstname, lastname} = req.body;
            sql = "INSERT INTO students(nickname, firstname, lastname) VALUES (?,?,?)"
            db.run(sql, [nickname, firstname, lastname], (err)=>{
                if(err) return res.json({status: 300,  success: false, error: err});

                console.log("added successfully.");
                res.json({status: 200,  success: true})
            })
        } else {
            res.send(err);
        }
    })
});


app.listen(
    PORT,
    () => console.log("hi. port: " + PORT)
)