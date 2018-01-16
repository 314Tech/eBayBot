'use strict';

const axios = require('axios');
const setup = require('./config.json');
const helpers = require('./utils/helpers');

var globalProducts = [];
var globalProductNumber = 0;
var globalProductCount = 0;

exports.handler = function (event, context, callback) {
  try {
     var _speech = '';
     var _product = '';
     var _action = '';

     if (event) {
			 const { result } = event;
         if (result) {
					 const { fulfillment, action, parameters } = result;
					 	console.log(`action: ${action}`);
						 _speech = '';

             if (fulfillment) {
                 _speech += fulfillment.speech;
                 _speech += ' ';
             }

						 if (action) {
                 _action = action;
             }

             if (parameters.any) {
                 _product = parameters.any;
             }

             console.log('action: ', _action);
             console.log('product: ', _product);
           }
       }

       // translate
       if (_action === 'find.product') {

				 // Call Ebay API
				 try {
					 const ebayAPIURL = 'http://svcs.sandbox.ebay.com/services/search/'
					 									+ 'FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='
														+ setup.EBAY_KEY
														+ '&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords='
														+ helpers.formatStringForURLName(_product)
	//													+ '&paginationInput.entriesPerPage=5'
					 axios.get(ebayAPIURL)
			     .then(response => {
						 if (response.data.findItemsByKeywordsResponse[0].searchResult[0]['@count'] > 0) {
							 globalProducts = response.data.findItemsByKeywordsResponse[0].searchResult[0].item;
							 globalProductCount = response.data.findItemsByKeywordsResponse[0].searchResult[0]['@count'];
							 var message = `I found ${globalProductCount} product${(globalProductCount >1) ? 's':''} listed on Ebay. Do you want to see the first one?`;
							 console.log('Send ');
							 callback(null, {
							  speech: message,
							  displayText: message,
							  source: 'webhook-ebay-bot',
							 });
						 } else {
							 callback(null, {
							  speech: `Sorry but I couldn't find any ${_product} curently listed on Ebay`,
							  displayText: `Sorry but I couldn't find any ${_product} curently listed on Ebay`,
							  source: 'webhook-ebay-bot',
							 });
						 }

			     })
			     .catch(error => {
			       console.log(error);
			     });
			   } catch (err) {
					 callback(err.message);
			   }

       } else if (_action === 'view.nextproduct'
                || _action === 'view.previousproduct') {
				 console.log(`Item index: ${globalProductNumber}/${globalProductCount}`);
				 console.log(`Item: ${globalProducts[globalProductNumber].title}`);

				 (_action === 'view.nextproduct') ? globalProductNumber++ : globalProductNumber--;
				 if (globalProductNumber>=globalProductCount) {
           globalProductNumber--;
					 callback(null, {
						speech: 'There are no more products to show. Say "previous" to navigate back',
 					  displayText: 'There are no more products to show. Say "previous" to navigate back',
 					  source: 'webhook-ebay-bot'
					 });
				 } else if (globalProductNumber<=0){
           globalProductNumber++;
					 callback(null, {
						speech: 'There are no previous products to show. Say "next" to navigate forward',
 					  displayText: 'There are no previous products to show. Say "next" to navigate forward',
 					  source: 'webhook-ebay-bot'
					 });
         } else {
					 var itemName = globalProducts[globalProductNumber].title;
					 var itemPictureURL = globalProducts[globalProductNumber].galleryURL;
					 var itemPrice = globalProducts[globalProductNumber].sellingStatus[0].convertedCurrentPrice[0]['__value__'];
					 var itemCondition = globalProducts[globalProductNumber].condition[0].conditionDisplayName[0];
					 var itemURL = globalProducts[globalProductNumber].viewItemURL;

					 console.log(`itemName: ${itemName}`);
					 console.log(`itemPrice: ${itemPrice}`);
					 console.log(`itemPictureURL: ${itemPictureURL}`);

           var postPhrase = '';
           if (globalProductNumber <= 1) {
             postPhrase = 'Say "next" or "previous" to navigate the results';
           }
					callback(null, {
					  speech: `A ${itemCondition} ${itemName} is for sale for \$${itemPrice}. ${postPhrase}`,
					  displayText: `A ${itemCondition} ${itemName} is for sale for \$${itemPrice}. ${postPhrase}`,
					  source: 'webhook-ebay-bot',
						data: {
							image: itemPictureURL,
							url: itemURL
						}
					 });
				 }
			 } else {
				 callback(null, {
					speech: 'Sorry but I didn\'t get what you just said',
 				  displayText: 'Sorry but I didn\'t get what you just said',
 				  source: 'webhook-ebay-bot'
				 });
       }
     } catch (err) {
         console.error(`Can't process event: ${err}`);
				 callback(err.message);
    }
};
