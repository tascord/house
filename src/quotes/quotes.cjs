const quotes_file = require('fs').readFileSync('./quotes.txt').toString();

let quotes = [];
let buffer = "";

for (line of quotes_file.split('\n')) {
    if (line == "") {
        quotes.push(buffer.trim());
        buffer = "";
    } else {
        buffer += line + " ";
    }
}

if (buffer.length > 0) {
    quotes.push(buffer.trim());
}

require('fs').writeFileSync('./quotes.json', JSON.stringify(quotes, null, 4));