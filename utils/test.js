const axios = require('axios');

// const {MPESA_CONSUMER_KEY,MPESA_CONSUMER_SECRET} = process.env

const generateAccessToken = async()=>{
    try {
        const {data} = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',{
            auth:{
                userName: MPESA_CONSUMER_KEY,
                password: MPESA_CONSUMER_SECRET
            }
        });
        console.log("Access Token::",data.access_token);
         
    } catch (error) {
        console.log(error.response);   
    };
};

 console.log('CONSUMER KEY=>', process.env.MPESA_CONSUMER_KEY);
 console.log('CONSUMER SECRET KEY=>', process.env.MPESA_CONSUMER_SECRET);
 console.log('TEST=>', process.env.MYSQL_DATABASE);
 


