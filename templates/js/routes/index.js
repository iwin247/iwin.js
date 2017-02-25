module.exports = (router)=>{
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  })

  return router;
}
