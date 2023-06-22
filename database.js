const sqlite3 = require('sqlite3').verbose();
const md5 = require("md5");

const DBSOURCE = "DB.SQLITE";

let db = new sqlite3.Database(DBSOURCE, (err)=>{
  if(err){
    console.log(err)
    throw err;
  }else{
    console.log("success")
    const sqlquery = `CREATE TABLE user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text, 
      email text UNIQUE, 
      password text, 
      CONSTRAINT email_unique UNIQUE (email)
      )`;
    db.run(sqlquery, (err)=>{
      if(err){
        console.log("table exists")
      }else{
        let insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
        db.run(insert, ["admin","admin@example.com",md5("admin123456")])
        db.run(insert, ["user","user@example.com",md5("user123456")])

      }
    })


  }
 
})
module.exports = db