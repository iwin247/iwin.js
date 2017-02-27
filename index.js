var multer = require('multer');
var Q = require('q');

var upload = (req, res, path) => {
  var deferred = Q.defer();
  var storage = multer.diskStorage({
      // 서버에 저장할 폴더
    destination: (req, file, cb) => {
      cb(null, path);
     },
     // 서버에 저장할 파일 명
     filename: (req, file, cb) => {
       var fileArr = file.originalname.split('.');
       file.uploadedFile = {
         name: fileArr[0], //file name
         ext: fileArr[1] //file type
        };
        cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
     }
   });
  var upload = multer({ storage: storage }).single('file');

  upload(req, res, (err) => {
    if(err) deferred.reject();
    else if(req.file === undefined){
     // if user not sened file u must controll here

    }else deferred.resolve(req.file.uploadedFile);
    
  });

  return deferred.promise;
};
 

global.upload = upload;
global.check_param = (req_param, params) =>{
  return params.every(str => req_param[str] != undefined && req_param[str] != null && req_param[str].length > 0);
}
