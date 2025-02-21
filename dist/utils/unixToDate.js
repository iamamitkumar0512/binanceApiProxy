"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUnixToDateTime = convertUnixToDateTime;
function convertUnixToDateTime(unixTimestamp) {
    const date = new Date(unixTimestamp);
    return date.toISOString(); // Format as "YYYY-MM-DDTHH:mm:ss.sssZ"
}
