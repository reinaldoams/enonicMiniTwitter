var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content')

// Handle the GET request
exports.get = function (req) {
    const component = portal.getComponent() || {};
    const config = component.config || {};
    // Get the country content as a JSON object
    const getPostsData = () => {
        var postsData = [];
        const postsFolder = config['pagesSite'] || false;
        
        if (postsFolder) {
            postsData = content.getChildren({
                key: postsFolder,
                start: 0,
                count: -1,
            }).hits.map(post => {
                post.page = content.get({ key: post._path }).data;
                post.href = portal.pageUrl({ id: post._id });
                return post;
            });
        }

        return postsData;
    }
    

    const getCreatePageData = () => {
        const pageCreate = config['postCreatePage'] || '';


        return {
            pageCreate: portal.pageUrl({ id: pageCreate }),
        }

    }

    // Specify the view file to use
    var view = resolve('homePage.html');

    var url = portal.pageUrl();

    var model = {
        url: url,
        pages: getPostsData(),
        config: getCreatePageData()
    }
    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model)
    }
};