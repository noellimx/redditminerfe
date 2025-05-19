var url = "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=200640&returnGeom=Y&getAddrDetails=Y&pageNum=1";
var authToken = '**********************'; // Replace with your access token
fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': "".concat(authToken), // API token for authorization
    }
})
    .then(function (response) { return response.json(); }) // Parse response as JSON
    .then(function (data) { return console.log(data); }) // Log the data to the console
    .catch(function (error) { return console.error('Error:', error); }); // Log any errors
