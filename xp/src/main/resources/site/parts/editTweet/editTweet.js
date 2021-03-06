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
    let params = req.params;
    let currentTweet = content.query({
        query: '',
        filters: {
            ids: {
                values: [params.id]
            }
        }
    });

    const users = getUsers();

    var view = resolve('editTweet.html');

    var model = {
        data: {
            users
        },
        currentTweet: currentTweet,
        config: {
            tweetsFolderPath: '/minitwitter/tweets'
        },
        serviceUrl: portal.serviceUrl({service: 'crudPost'})
    };

    return {
        body: thymeleaf.render(view, model)
    };
}