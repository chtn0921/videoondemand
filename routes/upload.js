var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
/*app.post('/upload', multipartMiddleware, function(req, resp) {
  console.log(req.body, req.files);
  // don't forget to delete all req.files when done
});*/


var papercut = require('papercut');

papercut.configure(function(){
  papercut.set('storage', 'file')
  papercut.set('directory', './uploads')
  papercut.set('url', '/uploads')
});


AvatarUploader = papercut.Schema(function(schema){
  /*schema.version({
    name: 'avatar',
    size: '200x200',
    process: 'crop'
  });

  schema.version({
    name: 'small',
    size: '50x50',
    process: 'crop'
  });*/
  
  schema.version({
    name: 'original',
    process: 'copy'
  });

});

router.get('/', function(req, res) {
	console.log("under get upload route");
});
/* upload file post. */
router.post('/', multipartMiddleware, function(req, res) {
	var response = {status : false, files: {}};
	uploader = new AvatarUploader();
	console.log("In post upload req.files : ",req.files);
	var fileName = "img-" + new Date().getTime();
	uploader.process(fileName, req.files.file.path, function(err,images){
	  if(err){
	  	console.log("error in image upload : ", err);	
	  }
	  response.status = true;  
	  response.files = images.original;
	  console.log("images", images);
	  res.json(response);
	  /*console.log("images.avatar:", images.avatar); // '/images/uploads/image1-avatar.jpg'
	  console.log("images.small:", images.small); // '/images/uploads/image1-small.jpg'		  */
	});	
	console.log(" end of the post upload");
});

module.exports = router;