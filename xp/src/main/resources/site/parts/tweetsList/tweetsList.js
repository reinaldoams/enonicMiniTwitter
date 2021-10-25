var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content')

// Handle the GET request
exports.get = function (req) {
    const component = portal.getComponent() || {};
    const config = component.config || {};

    // Get the country content as a JSON object
    const getTweetsData = () => {
        var tweetsData = [];
        const tweetsFolder = config['tweetsFolder'] || false;


        if (tweetsFolder) {
            tweetsData = content.getChildren({
                key: tweetsFolder,
                start: 0,
                count: -1,
            }).hits.map(tweet => {
                tweet.user = content.get({key: tweet.data.user}) ? content.get({key: tweet.data.user}).data : {};
                tweet.href = portal.pageUrl({id: tweet._id});
                return tweet;
            });
        }

        return tweetsData;
    }

    const getPagesData = () => {
        const pageUpdate = config['tweetUpdatePage'] || '';
        const pageDelete = config['tweetDeletePage'] || '';

        return {
            pageUpdate: portal.pageUrl({id: pageUpdate}),
            pageDelete: portal.pageUrl({id: pageDelete})
        }

    }

    // Specify the view file to use
    var view = resolve('tweetsList.html');

    var model = {
        tweets: getTweetsData(),
        config: getPagesData()
    }

    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model)
    }
};