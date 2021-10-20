var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content')

// Handle the GET request
exports.get = function(req) {

    // Get the country content as a JSON object
    const getUsersData = () => {
        const currentContent = portal.getContent();

        var usersData = content.getChildren({
            key: currentContent._path,
            start: 0,
            count: -1
        })

        for (var i = 0; i < usersData.hits.length; i++){
            usersData.hits[i].src = portal.attachmentUrl({id: usersData.hits[i].data.photo});
        }

        return usersData.hits;
    }

    // Specify the view file to use
    var view = resolve('usersList.html');

    var model = {
        users: getUsersData()
    }

    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model)
    }
};