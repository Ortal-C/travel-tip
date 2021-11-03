export const utils = {
    getDate,
}

function getDate(currDate) {
    const year = new Date(currDate).getFullYear();
    const month = new Date(currDate).getMonth();
    const day = new Date(currDate).getDate();
    const hours = new Date(currDate).getHours();
    const minutes = new Date(currDate).getMinutes();
    const seconds = new Date(currDate).getSeconds();
    const date = new Date(Date.UTC(year, month, day));
    const time = new Date(Date.UTC(0, 0, 0, hours, minutes, seconds));
    const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const newDate = date.toLocaleDateString('en-GB', optionsDate);
    const newTime = time.toUTCString().substring(17, 25);
    return newDate + ' ' + newTime;
}