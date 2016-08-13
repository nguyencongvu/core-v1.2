var appDomain = "localhost:8000"; //-- local 
// appDomain = "teamshow.sanphammoi.top";   //--EDIT  

module.exports = {
    'facebookAuth' : {
        'clientID'      : '273800019669298', // your App ID
        'clientSecret'  : 'ca492f45cb1323906c38cd3d12887be8', // your App Secret
        'callbackURL'   : 'http://'+appDomain+'/auth/facebook/callback', 
        'profileFields': ["id", "email", "gender", "about", "birthday", "cover"]
    },
    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://'+appDomain+'/auth/twitter/callback'
    },
    'googleAuth' : {
        'clientID'      : '873026146341-ce0605glrtsfebtiqt0vnsmd3k9nidfi.apps.googleusercontent.com',
        'clientSecret'  : 'F7hC_zdqcBQ-PwoBYl-Gcj1E',
        'callbackURL'   : 'http://'+appDomain+'/auth/google/callback'
    }, 
    'mailer' : {
        // service: "Gmail",
        // port: 465,
        // user: 'nguyencongvu@gmail.com',
        // pass: 'Go.1b.16', 

        service: "SendGrid",
        user: "dinhcu.top",
        pass: "Se.1b.16",
        from: 'system@domain.com', //-- reply To   
        templates: "../public/templates",
    }

};