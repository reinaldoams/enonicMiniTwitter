var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content')

// Handle the GET request
exports.get = function(req) {

    const getCategoryData = () => {
        const currentContent = portal.getContent();
        let categoryData = {};

        if (currentContent.type.split(':')[1] === 'category'){
            categoryData = currentContent.data;
            categoryData.photo = categoryData.photo && portal.attachmentUrl({id: categoryData.photo}) || null;
        }

        return categoryData;
    }

    const category = getCategoryData()
    var model = {
        category,
        show: Object.keys(category).length > 0
    };


    var view = resolve('categoryDetails.html');

    return {
        body: thymeleaf.render(view, model)
    }
};