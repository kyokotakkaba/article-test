exports.error = function (code, message) {
    return {
        success: false,
        code: code,
        message: message
    };
};

exports.success = function (data) {
    return respond = {
        success: true,
        data: data
    };
};

exports.successFilter = function (foundTotal, limit, data) {
    return respond = {
        success: true,
        properties: {
            total: foundTotal,
            limit: limit
        },
        data: data
    };
}