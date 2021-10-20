var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content');
var context = require('/lib/xp/context');
var node = require('/lib/xp/node');
var common = require('/lib/xp/common');

exports.get = req => {
    const postId = (req.params && req.params.id) || '';

    const post = content.get({ key: postId }) || {};

    return {
        body: {
            status: Object.keys(post).length > 0 ? '200' : '404',
            post
        },
        contentType: 'application/json'
    };
}

exports.post = req => {
    let siteUrl = portal.url(portal.getSite()._id);
    log.info(JSON.stringify(req.params))
    const data = req.params;
    if (data.requestType === 'delete') {
        content.delete({
            key: data.tweetId
        });
        
    } else if (data.requestType === 'put') {
        function editor(c) {
            c.data.user = data.user;
            c.data.tweetBody = data.tweetBody;
            return c;
        }
        var result = content.modify({
            key: data.tweetId,
            editor: editor
        });
        
    } else {
        log.info(JSON.stringify(data, null, 4));
        content.create({
            name: common.sanitize(data.tweetBody),
            parentPath: `${data['tweetsFolderPath']}`,
            displayName: data.tweetBody,
            contentType: `${app.name}:tweet`,
            data: {
                tweetBody: data.tweetBody,
                user: data.user,
            }
        })};
        
    return {
        redirect: '/'
    }
};