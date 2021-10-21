var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content');

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


    var view = resolve('deleteTweet.html');

    var model = {
        currentTweet: currentTweet,
        config: {
            postsFolderPath: '/minitwitter/tweets'
        },
        serviceUrl: portal.serviceUrl({service: 'crudPost'})
    };

    return {
        body: thymeleaf.render(view, model)
    };
}