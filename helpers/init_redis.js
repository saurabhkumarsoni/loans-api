const redis = require('redis');
let client;

(async () =>{
    client = redis.createClient({
        port: 6379,
        host: "127.0.0.1"
    });
    client.on('error', (error) =>{
        console.log(error.message);
    });

    await client.connect();
})



// client.on('connect', async()=>{
//     console.log('client is connected to redis');
// })

// client.on('ready', async()=>{
//     console.log('client is connected to redis and ready to use');
// })

// client.on('error', (error)=>{
//     console.log(error.message);
// })

// client.on('end', ()=>{
//     console.log('client is disconnected fro redis');
// })

// client.on('SIGINT', ()=>{
//     client.quit();
// })

module.exports = client;

