const app = require('express')();
const PORT = 3001;

app.listen(
    PORT,
    () => console.log("hi. port: " + PORT)
)


app.get('/students', (req, res) => {
    res.status(200).send({
        all_students: []
    })
});