var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content');


const getUsers = function () {
    return content.query({
        start: 0,
        count: -1,
        contentTypes: [`${app.name}:user`]
    }).hits.map((user) => {
        return {id: user['_id'], name: user.data.fullname}
    }).sort((a, b) => a.name.localeCompare(b.name));
}

exports.get = function (req) {
    var currentContent = portal.getContent();
    const users = getUsers();

    var view = resolve('deleteUser.html');

    var model = {
        data: {
            users
        },
        config: {
            tweetsFolderPath: '/minitwitter/tweets'
        },
        serviceUrl: portal.serviceUrl({service: 'crudUser'})
    }

    return {
        body: thymeleaf.render(view, model)
    }
}