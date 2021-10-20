var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content');
var context = require('/lib/xp/context');
var node = require('/lib/xp/node');
var common = require('/lib/xp/common');

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
        log.info(JSON.stringify(data, null, 4))
        content.create({
            name: common.sanitize(data.username),
            parentPath: `${data['usersFolderPath']}`,
            displayName: data.username,
            contentType: `${app.name}:user`,
            data: {
                fullname: data.username,
                photo: '',
                email: data.email
            }
        })
    };
    return {
        redirect: '/'
    }
};