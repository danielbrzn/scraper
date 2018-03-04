const request = require('request');
const cheerio = require('cheerio');
const readline = require('readline');

const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36';

function getPriceFromUrl(prodLink) {
    return new Promise(function(resolve, reject) {
        request(
            {
                url: prodLink,
                method: 'get',
                headers: {
                    'User-Agent': userAgent,
                }
            },
            function (err, res, body) {
                const $ = cheerio.load(body);
                let name = $('#productTitle').text().trim();
                let price = $('#priceblock_ourprice').text().trim();
                if (name === '' || price === '') {
                    reject('Failed to retrieve data');
                }
                else resolve({
                    name: name,
                    price: price,
                });
            }
        );
    });
}

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter Amazon product link: ', answer => {
    getPriceFromUrl(answer)
        .then(function(result) {
            console.log('The product ' + result.name + ' is priced at ' + result.price);
            rl.close();
            process.exit(0);
        }).catch(function(errorMsg) {
            console.log(errorMsg);
            process.exit(1);
    })
});
