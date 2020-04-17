const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
// MongoClient.connect('mongodb+srv://haack:JJFreak1950!@cluster0-pxojd.mongodb.net/test?retryWrites=true&w=majority', {
//     useUnifiedTopology: true
//   }, (err, client) => {
//     if (err) return console.error(err)
//     console.log('Connected to Database')
//   })
  // or using promises 
MongoClient.connect('mongodb+srv://haack:JJFreak1950!@cluster0-pxojd.mongodb.net/test?retryWrites=true&w=majority', {
     useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars')
    const quotesCollection = db.collection('quotes')
    app.use(express.static('public'))
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.get('/', (req, res) => {
        // res.sendFile(__dirname + '/index.html');  
        const cursor = db.collection('quotes').find().toArray()
        .then( results => {
            res.render('index.ejs', {quotes: results}) 
        })
        .catch(error => error.console(error)) 
    })

    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
                console.log(result)
            })
            .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Brian' },
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote
              }
            },
            {
                //options -tells us to insert doc if none found.
                upsert: true
            }
          )
            .then(response => {
                res.json('Success') 
            })
            .catch(error => console.error(error))
      })
    
      app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            { name: req.body.name }
          )
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vadar's quote`)
          })
          .catch(error => console.error(error))
      })

    app.listen(3000, function() {
        console.log('listening on 3000')
    })
  })
  .catch(error => console.error(error))

// Make sure you place body-parser before your CRUD handlers!
