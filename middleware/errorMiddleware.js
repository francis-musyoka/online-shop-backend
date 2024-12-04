


exports.errorHandle = (err, req, res, next) => {

    console.log('ERROR:::::', " ", err);
    
     res.status(err.statuscode || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
};