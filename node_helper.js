/* Magic Mirror Module: MMM-Powder helper
 * Version: 1.0.0
 *
*/

var NodeHelper = require('node_helper');
var axios = require('axios').default;

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-Powder helper, started...');
    },


    getWeatherData: function(payload) {

        var _this = this;
        this.url = payload;

		axios.get(this.url)
			.then(function (response) {
            // Lets convert the body into JSON
            var forecast = []; // Clear the array

            // Check to see if we are error free and got an OK response
            if (response.status == 200) {
                forecast = response.data;
            } else {
                // In all other cases it's some other error
                console.log('[MMM-Powder] ' + response.status);
            }

            // We have the response figured out so lets fire off the notifiction
            _this.sendSocketNotification('GOT-POWDER-FORECAST', {'url': _this.url, 'forecast': forecast});
        });
    },

    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-POWDER-FORECAST') {
            this.getWeatherData(payload);
        }
    }

});
