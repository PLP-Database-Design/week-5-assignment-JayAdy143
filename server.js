
// import our dependancies
const express= require("express");
const app = express();
const mysql=require('mysql2');
const dotenv=require('dotenv');

//cos and ejs


// configure environment variables
require('dotenv').config();

// creating a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


// test the connection 
db.connect((err)=> {
    // connection is not successful
    if(err){
        return console.log ("Error connecting to the database:",err);
    }

    // connection is successful
    console.log("Successfuly connected to MYSQL:",db.threadId)
});

app.set('view engine','ejs');
app.set('views', __dirname + '/views');

// Question 1 retrieve all patients
app.get('',(req,res)=>{
    const getPatients ="SELECT patient_id,first_name, last_name , date_of_birth FROM patients"
    db.query(getPatients,(err,data)=>{
        if(err){
            return res.status(400).send("Failed to fetch patients",err)
        }
        res.status(200).render('data',{data})
    })
})
 

// Question 2 retrieve all providers

app.get('',(req,res)=>{
    const getProviders ="SELECT first_name, last_name , provider_specialty FROM providers"
    db.query(getProviders,(err,data)=>{
        if(err){
            return res.status(400).send("Failed to fetch providers",err)
        }
        res.status(200).render('providers',{data})
    })
})


// Question 3 Filter patients by First Name

app.get('/patients/filter', (req, res) => {
    // Get the first_name from query parameters
    const firstName = req.query.first_name;
  
    // SQL query to select patients by first_name
    const getFilteredPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";
  
     db.query(getFilteredPatients, [firstName], (err, data) => {
      if (err) {
        console.error('Error fetching patients:', err);
        return res.status(400).send('Failed to fetch patients');
      }
  
      if (data.length === 0) {
        return res.status(404).send('No patients found with that first name');
      }
  
      res.status(200).render('filteredPatients', { data });
    });
  });


// Question 4 retrieve all providers
app.get('/providers/by-specialty', (req, res) => {
       const specialty = req.query.specialty;
       const getProvidersBySpecialty = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";
        db.query(getProvidersBySpecialty, [specialty], (err, data) => {
      if (err) {
        console.error('Error fetching providers:', err);
        return res.status(400).send('Failed to fetch providers');
      }
        if (data.length === 0) {
        return res.status(404).send('No providers found with that specialty');
      }
  
     res.status(200).render('filteredProviders', { data });
    });
  });


//start and listen to the server
app.listen(3300,()=>{
    console.log('server is running on port 3300...')
});
