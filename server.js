const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3001
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//create a route to go to notes html page and the main page
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

//create a get route
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.log(err)
        }else {
            res.json(JSON.parse(data))
        }
    } )
})
//post a note 
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.log(err)
        }else {
            let notes = JSON.parse(data) || []
            let newID = uuidv4();
            const newNote = req.body
            console.log(newNote)
            notes.push({...newNote, id:newID})
            fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
                if (err) {
                    console.log(err)
                }else {
                    res.json('succesfully added')
                    console.log('successfully added')
                }
            })
        }
    })
})
//delete a note
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.log(err)
        }else {
            let notes = JSON.parse(data) || []
            const id = req.params.id
            const index=notes.map(note=>note.id).indexOf(id)

            // let deletedNote = notes.filter(note => {
            //     note.id !== id
            // })
            notes.splice(index, 1)
            console.log(notes)
            fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
                if (err) {
                    console.log(err)
                }else {
                    res.json('succesfully deleted')
                    console.log('note has been deleted')
                }
            })
        }
    } )
})


app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
});