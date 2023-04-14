var jwt = require('jsonwebtoken');
const app = require('express')();
const PORT = 3001;


app.get('/', function(req, res){
    res.send('welcome.');
  })


app.get('/students', (req, res) => {
    res.status(200).send({
        all_students: [] // connect db
    })
});


app.get('/:nickname', (req, res) => {
    var token = jwt.sign({'nickname': req.params.nickname}, 'supersecret',{expiresIn: 120});
    res.json({'token': token});
});


app.post('/:nickname/:firstname/:lastname', (req, res) => {
    var token = jwt.sign({'nickname': req.params.nickname}, 'supersecret',{expiresIn: 120});
    jwt.verify(token, 'supersecret', function(err, decoded){
    if(!err){
        // add to DB
        var added = {'added' : 'yes', 'nickname': req.params.nickname, 'firstname': req.params.firstname};
        res.json(added);
    } else {
        res.send(err);
    }
    })
});


app.listen(
    PORT,
    () => console.log("hi. port: " + PORT)
)