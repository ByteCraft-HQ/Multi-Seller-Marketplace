const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
         const result = schema.safeParse(req.body);
        if(result.success){
            req.body = result.data;
            next();
        }
        else {
            const errorMessage = result.error.issues[0].message;
            return next(new AppError(errorMessage , 400))
        }
    };

module.exports = validate;