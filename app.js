const express   = require('express'),
        app     = express(),
        multer  = require('multer'),
        path    = require('path');


const port = 8080;
// Config Multer Storage & Upload
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        checkfile(file, cb)
    }
}).single('myfile');

// Check file type
const checkfile = (file, cb)=> {
    // Set file regular expressions
    let filetypes = /jpg|png|gif|jpeg/;
    // Test ext
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check MIME types
    let mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!')
    }
}

//APP Config
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + './public')));

//Routes
app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
       if(err){
           console.log(err);
           res.render('index', {msg:err});
       } else {
           if(req.file == undefined){
                res.render('index', {msg: 'Error no file selected!'});
           } else {
               console.log(req.file);
                res.render('index', {msg: `Uploaded ${req.file.originalname}`});
           }
       }
    });
});


app.listen(port, (req, res) => console.log(`Server is running on port ${port}`));