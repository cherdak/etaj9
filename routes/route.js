// handler for homepage
exports.index = function(req, res) {
  //  res.render('index', { title: 'Coffee Tagging'}); //Jade
  res.render('index.html', { title: 'Coffee Tagging'});
};

