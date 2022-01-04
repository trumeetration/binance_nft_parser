function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBinanceMarket(nftName, type, isBoxOpened = 2) {
    // 2 - not opened, 3 - opened box
    if (type == "mistery") {
        link =
            "https://www.binance.com/bapi/nft/v1/public/nft/market-mystery/mystery-list";
        _body = `{"page":1,"size":100,"params":{"keyword":"${nftName}","serialNo":null,"nftType":${isBoxOpened},"tradeType":0,"orderBy":"amount_sort","orderType":1}}`;
    }
    if (type == "nft") {
        link = "https://www.binance.com/bapi/nft/v1/friendly/nft/product-list";
        _body = `{\"amountFrom\":\"\",\"amountTo\":\"\",\"categorys\":[],\"currency\":\"\",\"mediaType\":\"\",\"tradeType\":0,\"page\":1,\"rows\":100,\"orderBy\":\"amount_sort\",\"orderType\":1,\"keyword\":\"${nftName}\"}`;
    }
    var response = await fetch(link, {
        headers: {
            accept: "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            clienttype: "web",
            "content-type": "application/json",
            "device-info":
                "eyJzY3JlZW5fcmVzb2x1dGlvbiI6IjI1NjAsMTQ0MCIsImF2YWlsYWJsZV9zY3JlZW5fcmVzb2x1dGlvbiI6IjI1NjAsMTQwMCIsInN5c3RlbV92ZXJzaW9uIjoiV2luZG93cyAxMCIsImJyYW5kX21vZGVsIjoidW5rbm93biIsInN5c3RlbV9sYW5nIjoicnUtUlUiLCJ0aW1lem9uZSI6IkdNVCs1IiwidGltZXpvbmVPZmZzZXQiOi0zMDAsInVzZXJfYWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvOTYuMC40NjY0LjExMCBTYWZhcmkvNTM3LjM2IiwibGlzdF9wbHVnaW4iOiJQREYgVmlld2VyLENocm9tZSBQREYgVmlld2VyLENocm9taXVtIFBERiBWaWV3ZXIsTWljcm9zb2Z0IEVkZ2UgUERGIFZpZXdlcixXZWJLaXQgYnVpbHQtaW4gUERGIiwiY2FudmFzX2NvZGUiOiJhNDBkZGEzMiIsIndlYmdsX3ZlbmRvciI6Ikdvb2dsZSBJbmMuIChOVklESUEpIiwid2ViZ2xfcmVuZGVyZXIiOiJBTkdMRSAoTlZJRElBLCBOVklESUEgR2VGb3JjZSBSVFggMjA2MCBEaXJlY3QzRDExIHZzXzVfMCBwc181XzAsIEQzRDExLTMwLjAuMTQuOTY3NikiLCJhdWRpbyI6IjEyNC4wNDM0NzUyNzUxNjA3NCIsInBsYXRmb3JtIjoiV2luMzIiLCJ3ZWJfdGltZXpvbmUiOiJBc2lhL1lla2F0ZXJpbmJ1cmciLCJkZXZpY2VfbmFtZSI6IkNocm9tZSBWOTYuMC40NjY0LjExMCAoV2luZG93cykiLCJmaW5nZXJwcmludCI6IjY5NmI4NzkxOTE2Y2IyNmVkOThhNmJiM2YwMWE3NTNlIiwiZGV2aWNlX2lkIjoiIiwicmVsYXRlZF9kZXZpY2VfaWRzIjoiIn0=",
            lang: "ru",
            "sec-ch-ua":
                '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        referrer: "https://www.binance.com/ru/nft/",
        referrerPolicy: "origin-when-cross-origin",
        body: _body,
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
    var searchResult = await response.json();
    searchResult = searchResult.data;
    var totalRowsFound = searchResult.total;
    var rows = type == "nft" ? searchResult.rows : searchResult.data;
    var price = "";
    for (var j = 0; j < totalRowsFound; j++) {
        var item = rows[j];
        if (item.timestamp < item.setStartTime) {
            console.log(`${item.timestamp} < ${item.setStartTime}`);
            continue;
        } else {
            price = `${item.amount} ${item.currency}`;
            break;
        }
    }
    return price;
}

async function getPricesNft() {
    var nftListSearch = document.getElementsByClassName("css-189i4rf");
    console.log(nftListSearch.length);
    if (nftListSearch.length) {
        var nftList = nftListSearch;
        var priceDict = {};
        if (nftList.length) {
            for (var i = 0; i < nftList.length; i++) {
                var prevPriceDiv =
                    nftList[i].children[1].children[0].getElementsByClassName(
                        " css-dc5ccz"
                    );
                if (prevPriceDiv.length) prevPriceDiv[0].remove();
                var nftName =
                    nftList[i].children[1].children[0].innerText.split("#")[0];
                if (!priceDict[nftName]) {
                    price = await fetchBinanceMarket(nftName, "nft");
                    if (price == "") {
                        console.log(`${nftName} not found`);
                        continue;
                    } else {
                        priceDict[nftName] = price;
                        nftList[
                            i
                        ].children[1].children[0].innerHTML += `<div class=" css-dc5ccz" style="color: red;">${price}</div>`;
                    }
                } else {
                    nftList[
                        i
                    ].children[1].children[0].innerHTML += `<div class=" css-dc5ccz" style="color: red;">${priceDict[nftName]}</div>`;
                }
                await sleep(1000);
            }
        }
    }
}

async function getPricesMistery() {
    var nftListSearch = document.getElementsByClassName("css-6txi8c");
    if (nftListSearch.length) {
        var nftList = nftListSearch;
        var priceDict = {};
        if (nftList.length) {
            for (var i = 0; i < nftList.length; i++) {
                var prevPriceDiv =
                    nftList[i].parentNode.parentNode.getElementsByClassName(
                        " css-dc5ccz"
                    );
                if (prevPriceDiv.length) prevPriceDiv[0].remove();
                var nftName = nftList[i].innerText;
                console.log(nftName);
                if (!priceDict[nftName]) {
                    price = await fetchBinanceMarket(nftName, "mistery");
                    if (price == "") {
                        price = await fetchBinanceMarket(nftName, "mistery", 3);
                        console.log(price);
                        if (price == "") {
                            console.log(`${nftName} not found`);
                            continue;
                        }
                    }
                    priceDict[nftName] = price;
                    nftList[
                        i
                    ].innerHTML += `<div style="color: red; background-color: rgb(245,245,245); border-radius: 4px; max-width: 120px; display: flex; justify-content: center;">${price}</div>`;
                } else {
                    nftList[
                        i
                    ].innerHTML += `<div style="color: red; background-color: rgb(245,245,245); border-radius: 4px; max-width: 120px; display: flex; justify-content: center;">${priceDict[nftName]}</div>`;
                }
                await sleep(1000);
            }
        }
    }
}

function getPrices() {
    if (document.URL.includes("nft/balance?tab=nft")) getPricesNft();
    if (document.URL.includes("nft/balance?tab=boxes")) getPricesMistery();
}

async function main() {
    do {
        await sleep(2000);
        var buttonsBar = document.getElementsByClassName("css-ov54vn")[0];
        if (buttonsBar) break;
    } while (true);
    document.getElementsByClassName(
        "css-1xvga6"
    )[0].innerHTML += `<button style="display: block; position: fixed; bottom: 20px; right: 80px; z-index: 99;" class=" css-1yd6866" id="mybutton">Parse price</button>`;
    var btn = document.getElementById("mybutton");
    btn.onclick = getPrices;
}

window.onload = main();
