import axios from "axios";

/**
 * 
 * This code, will request the project URL when the application is closed.
 * Thats will grant the application to be restarted, to not lost the CRON jobs. * 
 */

export function preventStop(){
    process
    .on('SIGTERM', shutdown('SIGTERM'))
    .on('SIGINT', shutdown('SIGINT'))
    .on('uncaughtException', shutdown('uncaughtException'));

    setInterval(async () => {
        await axios.get(process.env.BASE_URL || "");
    }, 120000)

}

function shutdown(signal : string) {
    return (err : any) => {
        setTimeout(() => {
            preventStop();
            process.exit(err ? 1 : 0);
        }, 5000).unref();
    };
}