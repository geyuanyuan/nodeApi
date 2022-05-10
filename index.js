const express = require('express')
let app = express()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type,Autherization");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
})
//single是单图片上传，多图片上传 array ,single里面就是上传图片的key值 
//和图片相关的是req.file 
app.use('/public', express.static(path.join(__dirname, './www')))
app.get('/test', (req, res) => {
  console.log(req)
    res.send({ msg: '成功！！！' })
})
app.get('download',(req,res)=>{
  res.send(
  //  'http://127.0.0.1:5500/public/images/16521431101409821.jpg'
  )
})
const upload = multer({ dest: 'uploads/'});
app.post('/upload', upload.single('upload'), (req, res) => {
  let imgFile = req.file;//获取图片上传的资源
  console.log(imgFile)
  let tmp = imgFile.path;//获取临时资源
  let ext = path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
  let newPath = "./www/images/" + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
  let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
  fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
  console.log('http://127.0.0.1:5500/public/images/' + newName)
  let newurl = 'http://127.0.0.1:5500/public/images/' + newName;
  res.send({"fileName":newName,"uploaded":1,"url":newurl});//上传成功之后  给客户端响应
  // {"fileName":"photo.png","uploaded":1,"url":"https:\/\/ckeditor.com\/apps\/ckfinder\/userfiles\/files\/photo.png"}
  // http://127.0.0.1:3007/img/1647057754040334.jpg
})


app.listen('5500', () => {
    console.log('start')
})