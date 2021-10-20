var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content');




exports.get = function (req) {
    var currentContent = portal.getContent();

    var view = resolve('createUser.html');

    var model = {
        
        config: {
            usersFolderPath: '/bootstrap-starter/users'
        },
        serviceUrl: portal.serviceUrl({service: 'crudUser'})
    }

    return {
        body: thymeleaf.render(view, model)
    }
}