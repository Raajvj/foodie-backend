const express = require("express");
const mycon = require("mysql");
const bodyparser = require("body-parser");
const cors = require("cors");
const multer = require("multer")

const upload = multer();

const app = express();

app.use(cors());
app.use(express.json());
app.use(upload.array());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));

var c = mycon.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "Kgisl@123",
    database : "mypro"
});

c.connect(function(err){
    if(err){console.log(err);}
    else{console.log('Databse Connected')}
})

app.post('/signup',(request,response)=>{
    let signup_type = request.body.signup_type;
    let name = request.body.name;
    let email = request.body.email;
    let phone = request.body.phone;
    let password = request.body.password;
    let address = request.body.address;

    let sql = 'insert into signup(name,email,phone,address,status)values(?,?,?,?,?)';
    let sqldata=[name,email,phone,address,0];
    let sql1='insert into signin(username,password,name,email,phone,role,status)values(?,?,?,?,?,?,?)';
    let sql1data=[email,password,name,email,phone,signup_type,0];
    c.query(sql,sqldata,(err,res)=>{
        if(err){
            let s={"status":"Signup_Error"};
            response.send(s);
        }
        else{
            c.query(sql1,sql1data,(err1,res1)=>{
                if(err1){
                    let s={"status":"signin_Error"};
                    response.send(s);
                }
                else{
                    let s={"status":"Signup_Successfully"};
                    response.send(s);
                }
            })
            
        }
    })
});

app.post('/buvva_login',(request,response)=>{
    let username = request.body.username;
    let password = request.body.password;

    let sql = 'select * from signin where username=?';
     c.query(sql,[username],(err,res)=>{
        if(err){
            let s = {"status":"username_error"};
            response.send(s);
        }
        else if(res.length > 0){
            let username1 = res[0].username;
            let password1 = res[0].password;
            let id = res[0].id;
            let role = res[0].role;
            if(username1 === username && password1 === password){
                let s = {"status":"Login_Successfully","id":id,"role":role};
                response.send(s);
            }
            else{
                let s = {"status":"Invalid_Login"};
                response.send(s);
            }
        }
        else{
            let s = {"status":"Invalid_Login"};
            response.send(s);
        }
     })

})

app.listen(3004);