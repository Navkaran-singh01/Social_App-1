const mediaSoup = require('mediasoup');

let worker ;


async function createWorker() {
    if(!worker){
        worker = await mediaSoup.createWorker();
        console.log("MediaSoup Worker is Created !!")

        worker.on("died",()=>{
            console.error("The mediaSoup Worker is dead , Need to restart it ");
            process.exit(1);
        })
    }
    return worker;
}

module.exports = {
    createWorker,
}