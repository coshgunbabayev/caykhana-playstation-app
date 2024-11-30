import {
    getAllTimeDB
} from "../database/modules/worker/time.js";

import {
    io
} from '../server.js'

function checkTimesLoop() {
    setInterval(async () => {
        checkTimes()
    }, 10 * 1000);
};

async function checkTimes() {
    const times = (await getAllTimeDB()).filter(time =>
        time.type === 'limited'
    );

    for (const time of times) {
        const updatedTime = new Date((new Date(time.start)).getTime() + time.time * 60 * 60 * 1000);
        const currentTime = new Date();

        if (updatedTime < currentTime) {
            io.emit('finishedTime', {
                id: time.tableId
            });
        };
    };
};

export {
    checkTimesLoop
};