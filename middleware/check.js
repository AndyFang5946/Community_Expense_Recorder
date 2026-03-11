module.exports = {
    checkLogin: function checkLogin(req, res, next){
        if(!req.session.user){
            req.flash('error', 'require signin');
            return res.redirect('/signin'); 
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req, res, next){
        if(req.session.user){
            req.flash('error', 'siginined');
            return res.redirect('back');
        }
        next();
    }
}