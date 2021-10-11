var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content');

exports.get = function (req) {
    let params = req.params;
    let currentPost = content.query({
        query: '',
        filters: {
            ids: {
                values: [params.id]
            }
        }
    });

    var view = resolve('deletePost.html');

    var model = {
        currentPost: currentPost,
        config: {
            postsFolderPath: '/bootstrap-starter/posts'
        },
        serviceUrl: portal.serviceUrl({service: 'crudPost'})
    };

    return {
        body: thymeleaf.render(view, model)
    };
}