module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    const checkrequest=require('../middleware/appmiddleware.js');

    //validate user login
    app.post('/user/login',checkrequest.checklogin,user.validatelogin);
    
    //user signup
    app.post('/user/signup',checkrequest.checksignup,user.signup);
    
}