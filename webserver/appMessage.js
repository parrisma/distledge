const appMessage = '\
<!DOCTYPE html>\
<html>\
<body style="background-color:#282c34;color:white;font-family:Verdana,sans-serif">\
\
<h1 style="font-size: 18px">ECR271 Option NFT Contract Server</h1>\
\
<h2 style="font-size: 16px">Available Command Patterns</h2>\
<ul>\
  <li>[localhost]:[portId]:/[optionId] : Get the OptionId terms as JSON</li>\
  <li>[localhost]:[portId]:/value/[OptionId] : Value the given Option Id</li>\
  <li>curl -v POST [localhost]:[portId] -d @[optionTerms].json --header "Content-Type: application/json : Create option terms</li>\
</ul>\
\
</body>\
</html>\
';

module.exports = {
    appMessage
}