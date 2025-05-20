export const loggingMiddleware = (req, _res, next) => {
    console.log(`${req.method} - ${req.url}`);
    console.log("Body:", req.body);

    next();
};
