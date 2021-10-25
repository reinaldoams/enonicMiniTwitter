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
    const data = req.params;
    if (data.requestType === 'delete') {
        content.delete({
            key: data.tweetId
        });
        context.run({
            branch: 'draft'
        }, function() {content.delete({
            key: data.tweetId
        })});
    } else if (data.requestType === 'put') {
        function editor(c) {
            c.data.user = data.user;
            c.displayName = common.sanitize(data.tweetBody);
            c.data.tweetBody = data.tweetBody;
            return c;
        }
        var result = content.modify({
            key: data.tweetId,
            editor: editor
        });
        context.run({
            branch: 'draft'
        }, function () {
            content.modify({
                key: data.tweetId,
                editor: editor
            });
        })
        content.publish({
            keys: [data.tweetId],
            sourceBranch: 'draft',
            targetBranch: 'master'
        });
    } else {
        let tweetData = {};
        let createNewContent = () => {
            let newContent = content.create({
                name: common.sanitize(data.tweetBody),
                parentPath: `${data['tweetsFolderPath']}`,
                displayName: common.sanitize(data.tweetBody),
                contentType: `${app.name}:tweet`,
                data: {
                    tweetBody: data.tweetBody,
                    user: data.user,
                }
            })
            tweetData = newContent;
        };
        context.run({
            branch: 'draft'
        }, createNewContent);
        content.publish({
            keys: [tweetData._id],
            sourceBranch: 'draft',
            targetBranch: 'master'
        });
    }

    return {
        redirect: '/'
    }
};