const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//----------------------------
// FILES

// Blocking, synchrosous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written");

// Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! 💥");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😁");
//       });
//     });
//   });
// });

// console.log("Will read file");

/*
*just showing the /product code

*slugs is the array with slugs elements

const server = http.createServer((req, res) => {
    const pathname = req.url
    const newString = pathname.replace('/product/', '')
   
    if(pathname === `/product/${newString}`){
        let i;
        slugs.forEach((el, index) => {
            if (el === newString){
                i = index;
            }
        });
 
        res.writeHead(200, {'content-type':'text/html'})
        const product = object[i]
        const output = replaceTemplate(templateProduct, product)
        res.end(output)
    }
* I changed the template-card.html to this:

<a class="card__link" href="/product/{%PRODUCTID%}">
*/

//---------------------------------
// SERVER

const tempOverView = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

dataObject.map(
  (ele) => (ele.ahref = slugify(ele.productName, { lower: true }))
);
// console.log(dataObject);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObject
      .map((ele) => replaceTemplate(tempCard, ele))
      .join('');
    const output = tempOverView.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello world',
    });
    res.end('Page not found');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
