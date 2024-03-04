# BackpackTF-Listings-Converter

This UserScript converts listing prices on [backpack.tf](https://backpack.tf/) to their corresponding dollar values based on the user-set Mann Co. Supply Crate Key price.

## Installation

1. **Install Tampermonkey**: If you haven't already, You can find Tampermonkey for [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/), [Edge](https://www.microsoft.com/en-us/p/tampermonkey/9nblggh5162s), [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089), and [Opera](https://addons.opera.com/en/extensions/details/tampermonkey-beta/).

2. **Open the Script**: Click [here](https://github.com/exampleuser/listings-to-dollar-converter/raw/main/listings-to-dollar-converter.user.js) to download the UserScript. Tampermonkey should automatically recognize the script and prompt you to install it. Confirm the installation.

## Setting the Mann Co. Supply Crate Key $ Price

1. Navigate to [backpack.tf](https://backpack.tf/).

2. Allow the autobot.tf price fetch. And a menu will show up and you'll find an input field labeled "Key $ Price". Enter the current key price in dollars in this field. For example, if the key price is 1.66, enter "1.66" (without quotes).

3. Click "Save". The page will refresh, and the script will use the provided key price for conversions.

4. To UPDATE the Key price click on the cat icon (<img src="https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSIYhY_9XEDYOMNRBsMoGuuOgceXob50kaxV_PHjMO1MHaEqgAmo9Sluha-FkTznMSxrnFf6qevMP1sc_bEDzfFk7pw6OA4S3vkxEt04G3UnNn9bzvJObtcxna3/96fx96f?allow_animated=1" alt="Cat Icon" width="24" height="24">) The menu should show up again.

# Resume

Now, whenever you visit backpack.tf, the listings will be converted to their equivalent dollar values based on the key price you've set.

**Note**: If you don't see the cat icon, ensure that the UserScript is properly installed and enabled in Tampermonkey. You may need to refresh the page after installing the script.
