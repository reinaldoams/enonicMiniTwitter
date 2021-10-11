var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content')
var context = require('/lib/xp/context')
var node = require('/lib/xp/node')

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
        log.info('deletando')
        content.delete({
            key: data.postId
        });
        log.info(JSON.stringify(siteUrl, null, 4));
        
    } else if (data.requestType === 'put') {
        log.info('modificando')
        function editor(c) {
            c.displayName = data.title;
            c.data.title = data.title;
            c.data.shorttitle = data.shorttitle;
            c.data.author = data.author;
            c.data.html = data.html;
            c.data.category = data.category;
            return c;
        }
        var result = content.modify({
            key: data.postId,
            editor: editor
        });
        
    } else {
        content.create({
            _name: data.title.split(' ').join('-').toLowerCase(),
            parentPath: `${data['postsFolderPath']}`,
            displayName: data.title,
            contentType: `${app.name}:post`,
            data: {
                title: data.title,
                shorttitle: data.shorttitle,
                html: data.html,
                category: data.category,
                author: data.author,
            }
        })
    };
    return {
        redirect: '/'
    }
};