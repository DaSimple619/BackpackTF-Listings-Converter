// ==UserScript==
// @name         Listings to dollar converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts to mannco price or something...
// @author       chatgpt
// @match        https://backpack.tf/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>
// ==/UserScript==

(async () => {
    let listings = document.querySelectorAll("div.item");
    const keyPrice = (await getKeyPrice()).keyPrice;

    let manncoKeyPrice = await GM_getValue("manncoKeyPrice");
    if (!parseFloat(manncoKeyPrice)) return openMenu('Set mannco price!');
    else manncoKeyPrice = parseFloat(manncoKeyPrice);

    for (let l = 0; l < listings.length; l++){
        let listing = listings[l];

        const priceString = listing.getAttribute('data-listing_price')

        // ignore mp listings
        if (!priceString) continue;
        const price = extractPrice(priceString);

        console.log(price);
        let convertedPrice = 0;

        if (parseFloat(price[0])) convertedPrice = manncoKeyPrice * parseFloat(price[0]);
        if (parseFloat(price[1])) convertedPrice += (manncoKeyPrice /keyPrice) * parseFloat(price[1]);

        let container = document.createElement('div');
        container.style.margin = '6px'
        container.style.display = 'flex'
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';
        container.style.cursor = 'pointer'
        container.onclick = () => openMenu();

        let img = document.createElement('img');
        img.src = "https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSIYhY_9XEDYOMNRBsMoGuuOgceXob50kaxV_PHjMO1MHaEqgAmo9Sluha-FkTznMSxrnFf6qevMP1sc_bEDzfFk7pw6OA4S3vkxEt04G3UnNn9bzvJObtcxna3/96fx96f?allow_animated=1"
        img.style.width = '24px'
        container.append(img)

        let mannCoPriceElement = document.createElement('span');
        mannCoPriceElement.textContent = `$${Math.max(0.01, convertedPrice.toFixed(2))}`
        container.append(mannCoPriceElement);

        listing.parentNode.append(container);

        console.log(convertedPrice)
    }

    async function openMenu(title = "mannco.store key price (ex: 1.66)") {
        const manncoKeyPrice = await GM_getValue("manncoKeyPrice");

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';

        const label = document.createElement('div');
        label.style.display = 'flex';
        label.style.gap = '8px';
        container.style.alignItems = 'center';
        container.append(label);

        let img = document.createElement('img');
        img.src = "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ/330x192?allow_animated=1"
        img.style.width = '24px'
        img.style.objectFit = 'contain';
        label.append(img)

        let labelText = document.createElement('span');
        labelText.textContent = 'Key $ Price'
        label.append(labelText);

        const field = document.createElement('input');
        field.setAttribute('type', 'text');
        field.className = 'form-control';
        field.style.width = 'auto';
        field.value = manncoKeyPrice;
        container.append(field);

        const saveBtn = document.createElement('div');
        saveBtn.textContent = 'Save';
        saveBtn.className = "btn btn-default";
        saveBtn.setAttribute('data-dismiss', 'modal')
        saveBtn.onclick = () => {
            console.log(field.value);
            GM_setValue("manncoKeyPrice", field.value);
            location.reload();
        }

        const modal = Modal.render(title, container, saveBtn);
    }

    // Following code yoinked from Zeus -> https://github.com/Bonfire/bptf-bot-utilities/blob/master/bptf-bot-utilities.user.js

    // Fetch the price of a key in refined and store it
    // Only fetch this if the user has no keyData stored or it's been 30 minutes since the last fetch
    async function getKeyPrice() {
        let fetchedData = await GM_getValue("keyData")
        if (fetchedData) {
            let keyData = JSON.parse(fetchedData);

            let elapsedMillis = new Date() - keyData["timeStamp"];
            if (elapsedMillis >= 1_800_000) {
                await fetchKeyPrice();
            } else {
                let KEY_PRICE = keyData["keyPrice"];
                /*console.log(
                    "Key price fetched from storage. Current key price: " +
                    KEY_PRICE +
                    " ref"
                );
                console.log(
                    "Key price will next be fetched remotely in " +
                    ((1_800_000 - elapsedMillis) / 60_000).toFixed(2) +
                    " mins"
                );*/
            }
        } else {
            await fetchKeyPrice();
        }

        return JSON.parse(await GM_getValue("keyData"));
    }

    function fetchKeyPrice() {
        // Reach out to Prices.TF to grab the current key selling price
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://autobot.tf/json/items/5021;6",
            onload: async function (response) {
                // Parse the sell price of the key in refined
                var keyResponse = JSON.parse(response.responseText);

                // Log to the user the current key price
                console.log(
                    "Fetched key price from remote source: " +
                    keyResponse["sell"]["metal"] +
                    " ref"
                );

                // Set the KEY_PRICE
                KEY_PRICE = keyResponse["sell"]["metal"];

                let keyData = {
                    keyPrice: KEY_PRICE,
                    timeStamp: new Date().getTime(),
                };

                // Store the KEY_PRICE and the current timestamp
                await GM_setValue("keyData", JSON.stringify(keyData));
                console.log("Stored key data for 30 minutes");
            },
        });
    }

    function extractPrice(priceString) {
        let listingPrice = priceString;

        // Split the string in the event that the item has a key, ref price
        let splitString = listingPrice.split(",");

        // If we are working with a key, ref price...
        if (splitString.length > 1) {
            return [
                splitString[0].replace("keys", "").replace("key", "").trim(),
                splitString[1].replace("ref", "").trim(),
            ];
        } else {
            if (splitString[0].includes("key")) {
                // If the item is priced in the "X keys" format
                let keyPrice = splitString[0]
                .replace("keys", "")
                .replace("key", "")
                .trim();
                let splitKey = keyPrice.split(".");

                if (splitKey.length > 1) {
                    return [splitKey[0], KEY_PRICE * (splitKey[1] / 10)];
                } else {
                    return [keyPrice, null];
                }
            } else {
                // If the item is priced in the "X ref" format
                return [null, splitString[0].replace("ref", "").trim()];
            }
        }
    }
})();
