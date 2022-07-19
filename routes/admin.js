var express = require('express');
var router = express.Router();
var pool=require('./pool');
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/adminlogin', function(req, res, next) {
  res.render('adminlogin',{msg:''});
});
router.get('/logout', function(req, res, next) {
  localStorage.clear();
  res.redirect('/admin/adminlogin');
});

router.post('/chkadminlogin', function(req, res, next) {
  pool.query("select * from admin where emailid=? and password=?",[req.body.emailid,req.body.password] ,function(error,result){
    if(error){
      console.log(error)
      res.render("adminlogin",{msg:"Server Error"})
    }
    else{
      if(result.length==1){
        localStorage.setItem('ADMIN',JSON.stringify(result[0]))
        res.render("dashboard",{result:result[0]})
      }
      else{
        res.render("adminlogin", {msg:"Invalid Password and Id"})
      }
    }
  })
})
module.exports = router;
