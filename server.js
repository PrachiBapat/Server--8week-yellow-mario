import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

// connecting to the local host
const db = mysql.createConnection ({
  host: 'localhost',
  port: 3306,
  user:'root',
  password:'',
  database:'products'

});

const server = express();
server.use(cors());
server.use(express.json());

db.connect(error =>{
    if(error)
    console.log('Sorry cannot connect to db :', error);
    else
    console.log('Connected to mysql db');
  })
  
  // server.get('/productsapi',(req,res)=>{
  
    // Select from the product table
    //stored procedures for allproducts
  //   let allproductsSP = "SELECT * FROM product"
  //   let query = db.query(allproductsSP,(error,data,fields) => {
      
  //     if(error){
  //       res.json({ ErrorMessage:error })
        
  //     }
  //     else{
     
  //     res.json(data);
  //   }
  
  //   })
  // })
  
  //display all products
  server.get('/productssp', (req, res) => {
    let allproductSP = "CALL `All_products`()";
    // let  allproductsSP  = "SELECT * FROM All_products"
    db.query(allproductSP, (error, data, fields) => {
      if(error){
        res.json({ ErrorMessage: error });
        // console.log(error);
      }
      else{
        res.json(data[0]);
      }
      
    })
  })

  //productbyID
  server.get("/productssp/:id", (req, res) => {
    let ByID = "CALL `All_products`()";
    let productbyid = req.params.ID;
    db.query(ByID, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            res.json(data[0].find(x => x.ID == productbyid));
        }
    });
});


 //admin all products
  server.get('/admin', (req, res) => {
    let allproducts = "CALL `Alladminproduct`()";
    
    db.query( allproducts, (error, data, fields) => {
      if(error){
        res.json({ ErrorMessage: error });
        // console.log(error);
      }
      else{
        res.json(data[0]);
      }
      
    })
  })

 
  
  // LOGIN
server.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let loginQuery =  "CALL `login`(?,?)";
  db.query(loginQuery, [email, password], (error, data) => {
    if(error){
      res.json({ ErrorMessage: error});
    }
    else{
      if(data[0].length === 0){
        res.json({ data: data[0], login: false, message: "Sorry, you have provided wrong credentials"})
      }
      else{
        res.json({ 
            ID: data[0].ID, 
            email: data[0].email,
            data: data[0],
            login: true, 
            message: "Login successful"});
            // create the Auth Key
      }

      
    }
  })

});


// editproduct
server.put('/editproduct', (req, res) => {
  let description = req.body.description;
  let ID = req.body.ID;
  let price = req.body.price;
  let productTitle = req.body.productTitle;
  let stockAvailability = req.body.stockAvailability;
  let query = "CALL `editproduct`(?, ?, ?,?)";
  db.query(query, [description,ID, price, productTitle,stockAvailability], (error, data) => {
    if(error){
      res.json({ edit: false, message: error });
    }
    else{
      res.json({ edit: true, message: "Product successfully edited"});
    }
  })
});

//display edited product
server.put('/editeddisplay', (req, res) => {
  let ID = req.body.ID;
  let display = req.body.display;
  let query = "CALL `editeddisplay`(?,?)";
  db.query(query,[ID,display], (error, data) => {
      if (error) {
          res.json({ editeddisplay: false, message: error });
      } else {
          res.json({ data: data[0], editeddisplay: true, message: "Edited product successfully displayed" })
      }
  })
})


// Addnewproduct
server.post("/addnewproduct", (req, res) => {
  let description = req.body.description;
  let ID = req.body.ID;
  let price = req.body.productTitle;
  let productTitle = req.body.price;
  let stockAvailability = req.body.stockAvailability;
  
  let query = 'CALL `addoneproduct`(?, ?, ?, ?)';
  db.query(query, [description,ID, price, productTitle,stockAvailability], (error, data) => {
      if (error) {
          res.json({
              insert: false,
              message: error
          })
      } else {
          res.json({
              data: data[0],
              insert: true,
              message: "New product successfully added."
          })
      }
  })
})

//productby id
server.get('/product/:id', (req, res) => {
  let ID = req.params.ID;
  let getbyID = "CALL `getProductbyID`(?)";
  db.query(getbyID, [ID], (error, data) => {
      if (error) {
          res.json({ ID: false, message: error })
      } else {
          if (data[0].length === 0) {
              res.json({ ID: false, message: "No such product ID exist" })
          } else {
              res.json({ ID: true, message: "success", productData: data[0] })
          }
      }
  })
})

//delete product
server.delete('/deleteproduct/:id', (req, res) => {
  let ID = req.params.ID;
  let deleteID = "CALL `deletebyID`(?)";
  db.query(deleteID, [ID], (error, data) => {
      if (error) {
          res.json({ deletebyID: false, message: error });
      } else {
          res.json({ deletebyID: true, message: "Product deleted successfully" });
      }
  })
})



server.get('/onlineproducts' , (req, res) =>{
  let online = "CALL `diplayonline`()";
  db.query(online , (error, data) => {
    if (error) {
      res.json({ ID: false, message: error })
  } 
  else {
     res.json(data[0])
     
  }
})
})

 




  server.listen(4600, function() {
    console.log('Server is successfully running on port 4600');
    
})