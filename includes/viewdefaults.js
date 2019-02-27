module.exports = function(options) {
  return function(req, res, next) {
    res.locals.viewsettings = {
      isLoggedIn: req.isAuthenticated(),
      errorflash:req.flash('error'),
      successflash:req.flash('success'),
      GACode:options.gacode
    }
    next();
  }
}
