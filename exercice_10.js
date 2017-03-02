const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
const ObjectId = require('mongodb').ObjectID;
app.set('view engine', 'ejs'); // générateur de template «ejs»
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))  // pour utiliser le dossier public

var db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017/adresse', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(8081, () => {
    console.log('connexion à la BD et on écoute sur le port 8081')
  })
})




//page de base
app.get('/',  (req, res) => {
   console.log('la route route get / = ' + req.url)
   //récupère la bdd
    var cursor = db.collection('adresse').find().toArray(function(err, resultat){
       if (err) return console.log(err)
    // affiche le contenu de la BD
    res.render('index2.ejs', {adresse: resultat})

    }) 
    

})

//page d'accès au formulaire de modication
app.get('/formulaire',  (req, res) => {
   console.log('la route  get / = ' + req.url)
   //récupère la bdd
    var cursor = db.collection('adresse').find().toArray(function(err, resultat){
       if (err) return console.log(err)
    //récupère le dernier chiffre (pour le id)
    console.log(req.url.substring(req.url.length - 1));
    //envoie l'adresse et le id au formulaire
    res.render('formulaire.ejs', {adresse: resultat,id:req.url.substring(req.url.length - 1)})
      }) 

})

//lorsqu'on ajoute une adresse
app.post('/adresse',  (req, res) => {
  db.collection('adresse').save(req.body, (err, result) => {
      if (err) return console.log(err)
      console.log('sauvegarder dans la BD')
      res.redirect('/')
      console.log(req.body)
    })
})

//lorsqu'on delete une adresse
app.post('/delete',  (req, res) => {
  //supprime l'adresse sélectionnée
db.collection('adresse').remove ({_id: ObjectId(req.body._id)}, (err, result) => {
  if (err) {return console.log(err)}
      console.log(req.body._id)
    //retourne à la page de base
      res.redirect('/')
})
})

//lorsqu'on confirme l'update d'une adresse
app.post('/update',  (req, res) => {
  //collecte les valeurs entrées pour changer l'adresse sélectionnée
db.collection('adresse').update ({_id: ObjectId(req.body._id)},{$set:{'nom':req.body.nom,
  "telephone":req.body.telephone,"ville":req.body.ville,"code":req.body.code}}, (err, result) => {
  if (err) {return console.log(err)}
      console.log(req.body)
      //retourne à la page de base
      res.redirect('/')
  })
})
