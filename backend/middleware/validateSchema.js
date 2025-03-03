const validateSchema = (schema, source = 'body') => {
    return (req, res, next) => {
        const dataToValidate = {
            'body': req.body,
            'params': req.params,
            'query': req.query
        }[source];

        const { error } = schema.validate(dataToValidate);
        
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        
        next();
    };
};

export default validateSchema;