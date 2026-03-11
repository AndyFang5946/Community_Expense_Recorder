module.exports = function(app) {
    app.get("/", function(req, res){
        res.redirect("/post");
    });
    app.use("/signup", require('./signup'));
    app.use("/signin", require('./signin'));
    app.use("/post", require('./post'));
    app.use("/signout", require('./signout'));
    app.use("/comments", require('./comments'));
    app.use(function(req, res) {
        if(!res.headersSent){
            res.status(404).render('404');
        }
    });
}