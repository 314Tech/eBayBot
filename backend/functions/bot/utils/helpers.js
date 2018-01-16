'use strict';

exports.formatStringForURLName = function (text) {
  console.log(`Function : formatStringForURLName( ${text})`);

  // remove trailing and leading spaces
  text = text.trim();
  // replace all spaces by %20
  text = text.replace(/ /g, '%20');
  return text;
};
