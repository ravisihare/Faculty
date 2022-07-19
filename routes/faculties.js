var express = require('express');
var router = express.Router();
var pool=require('./pool');
var upload = require('./multer');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/facultyinterface', function(req, res, next) {
  var result=JSON.parse(localStorage.getItem("ADMIN"))
  if(result)
  res.render('facultiesinterface',{msg:'',result:result});
  else
  res.redirect("/admin/adminlogin")
});
router.get('/dashboard', function(req, res, next) {
  var result=JSON.parse(localStorage.getItem("ADMIN"))
if(result)
  res.render('dashboard',{msg:'',result:result});
  else
  res.redirect("/admin/adminlogin")
});

router.get('/showimage', function(req, res, next) {
  var cresult=JSON.parse(localStorage.getItem("ADMIN"))
if(cresult)
  res.render('showimage',{result:req.query,cresult:cresult});
  else
  res.redirect("/admin/adminlogin")
});

router.get('/fetchallcities', function(req, res, next) {
  console.log(req.query)

  pool.query("select * from cities where stateid=?",[req.query.stateid],function(error, result){
    if(error){
      console.log(error)
  res.status(500).json([])
    }
    else{
      res.status(200).json(result)
      }
  })

})

router.get('/showallfaculties',function(req,res,next){
  var aresult=JSON.parse(localStorage.getItem("ADMIN"))

  pool.query("select * from faculty",function(error,result){
if(error){
  console.log(error)
  res.render('displayfaculties',{result:false})
}
else{
  console.log(result)
  if(aresult)
  res.render('displayfaculties',{result:result,aresult:aresult})
  else
  res.redirect("/admin/adminlogin")
}
  })

});

router.get('/displaybyid',function(req,res,next){
  var bresult=JSON.parse(localStorage.getItem("ADMIN"))

  pool.query("select * from faculty where facultyid=?",[req.query.fid],function(error,result){
if(error){
  console.log(error)
  res.render('displaybyid',{result:false})
}
else{
  console.log(result)
  if(!bresult)
  res.redirect("/admin/adminlogin")
  else if(result.length>=1)
  res.render('displaybyid',{data:result[0],bresult:bresult})
 else
 res.render("searchfaculty",{msg:"not found",result:"",bresult:bresult});

}
  })

});

router.get('/fetchallstate', function(req, res, next) {
  console.log(req.query)
  pool.query("select * from state",function(error, result){
  if(error){
    console.log(error)
res.status(500).json([])
  }
  else{
    res.status(200).json(result)
  }
})
});

router.post('/submitfaculty', upload.single("image"), function(req, res, next) {
  console.log("BODY",req.body)
  console.log("FILE",req.file)
  
  pool.query("insert into faculty (firstname,lastname,birthdate,gender,mobileno,email,address,state,city,zipcode,qualification,department,image)values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.firstname,req.body.lastname,req.body.birthdate,req.body.gender,req.body.mobileno,req.body.email,req.body.address,req.body.state,req.body.city,req.body.zipcode,req.body.qualification,req.body.department,req.file.originalname],function(error, result){
  if(error){
    console.log(error)
res.render("facultiesinterface",{msg:'server error',result:''})
  }
  else{
   
    res.render("facultiesinterface",{msg:'Record Submitted',result:''})

  }
})
});

router.post('/editpicture', upload.single("image"), function(req, res, next) {
  console.log("BODY",req.body)
  console.log("FILE",req.file)
  

  pool.query("update faculty set image=? where facultyid=?",[req.file.originalname,req.body.facultyid],function(error, result){
    if(error){
      console.log(error)
  res.redirect("/faculty/showallfaculties")
    }
    else{
      res.redirect("/faculty/showallfaculties")
  
    }
})
});

router.get('/editdelete', function(req, res, next) {
  console.log(req.query);
  if(req.query.btn=="Edit")
  {

  pool.query("update faculty set firstname=?,lastname=?,birthdate=?,gender=?,mobileno=?,email=?,address=?,state=?,city=?,zipcode=?,qualification=?,department=? where facultyid=?",[req.query.firstname,req.query.lastname,req.query.birthdate,req.query.gender,req.query.mobileno,req.query.email,req.query.address,req.query.state,req.query.city,req.query.zipcode,req.query.qualification,req.query.department,req.query.facultyid],function(error, result){
  if(error){
    console.log(error)
res.redirect("/faculty/showallfaculties")
  }
  else{
    res.redirect("/faculty/showallfaculties")

  }
})
  }
  else{
    pool.query("delete from faculty where facultyid=?",[req.query.facultyid],function(error, result){
      if(error){
        console.log(error)
    res.redirect("/faculty/showallfaculties")
      }
      else{
        res.redirect("/faculty/showallfaculties")
    
      }
    })
  }
});

router.get('/searchbyid',function(req,res,next){
  var fresult=JSON.parse(localStorage.getItem("ADMIN"))
  if(fresult)
  res.render("searchfaculty",{msg:"",result:"",fresult:fresult});
  
  else
  res.redirect("/admin/adminlogin")
})

module.exports = router;
