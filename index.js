var multer = require('multer');
var Q = require('q');

var upload = (req, res) => {
  var deferred = Q.defer();
  var storage = multer.diskStorage({
      // 서버에 저장할 폴더
    destination: (req, file, cb) => {
      cb(null, "upload/");
     },
     // 서버에 저장할 파일 명
     filename: (req, file, cb) => {
       file.uploadedFile = {
         name: file.minmetype.split('/')[0], //file name
         ext: file.mimetype.split('/')[1] //file type
        };
        cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
     }
   });
  var upload = multer({ storage: storage }).single('file');

  upload(req, res, (err) => {
    if(err) deferred.reject();
    else if(req.file === undefined){
      check_param(req.body, params, res);
      var title = req.body.title;
      var token = req.body.token;
      var contents = req.body.contents;

      Users.findOne({token: token}, function(err, result) {
        if (err) return res.status(500).send("DB error");
        else if(!result) return res.status(401).send("not valid token");

        var current = new Boards({
          boardid: boardid,
          title: title,
          writer: result.name,
          writerToken: token,
          writer_profile: result.profile_image,
          date: date,
          contents: contents,
        });

        current.save(function(err, data) {
          if (err) return res.status(409).send("DB error");
          return res.status(200).send("success");
        });
     });

    }else deferred.resolve(req.file.uploadedFile);
    
  });

  return deferred.promise;
};

global.upload = upload;
global.check_param = (req_param, params) =>{
  return params.every(str => req_param[str] != undefined && req_param[str] != null && req_param[str].length > 0);
}
