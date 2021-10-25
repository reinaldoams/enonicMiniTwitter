var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');
var content = require('/lib/xp/content');
var context = require('/lib/xp/context');
var node = require('/lib/xp/node');
var common = require('/lib/xp/common');

const forceArray = function (data) {
    if (!Array.isArray(data)) {
        data = [data];
    }
    return data;
}
function runInsideContext(branch, callback) {
    return context.run({
        repository: 'com.enonic.cms.default',
        principals: ["role:system.admin"],
        branch,
        user: {
            login: 'su',
            idProvider: 'system'
        },
        principals: ['role:system.admin']
    }, () => {
        return callback()
    })
}

exports.post = function (req) { return runInsideContext('draft', () => tudoAqui(req)); }

function tudoAqui(req) {
    let siteUrl = portal.url(portal.getSite()._id);
    const data = req.params;
    if (data.requestType === 'delete') {
        const teste = content.getAttachments(data.user).photo
        log.info(JSON.stringify(teste, null, 4))
        context.run({
            branch: 'master',
            principals: ["role:system.admin"],
        }, function () {
            content.delete({
                key: data.user
            })
        });
        content.delete({
            key: data.user
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
        var result = portal.getMultipartForm();
        log.info(JSON.stringify(result, null, 4));
        var photoStream = portal.getMultipartStream('photo');
        let userData = {};

        var photoCreated = content.createMedia({
            name: result.photo.fileName,
            parentPath: '/minitwitter/images',
            mimeType: result.photo.contentType,
            data: photoStream
        });


        // let createNewUser = () => {
        let newUser = content.create({
            name: data.username,
            displayName: data.username,
            parentPath: `${data['usersFolderPath']}`,
            contentType: `${app.name}:user`,
            data: {
                fullname: data.username,
                email: data.email,
                photo: photoCreated._id
            }
        })
        userData = newUser;
        // };

        // const multiPart = fetch(url, {
        //     mode: 'no-cors',
        //     method: method || null,
        //     headers: {
        //         'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     body: JSON.stringify(data) || null,
        // })

        // const formData = new FormData();

        // formData.append('file', multiPart.files[0]);


        content.publish({
            keys: [userData._id],
            sourceBranch: 'draft',
            targetBranch: 'master'
        });
        // content.addAttachment({
        //     key: [userData._id],
        //     name: 'photo',
        //     mimeType: 'image/png',
        //     label: 'photo',
        //     data: photoStream
        // })
    };
    return {
        redirect: '/'
    }
};