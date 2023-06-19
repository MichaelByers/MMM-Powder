/* Magic Mirror Module: MMM-Powder
 * Version: 1.0.0
 *
 * By Michael Byers https://github.com/MichaelByers/
 * MIT Licensed.
 */

Module.register('MMM-Powder', {

	defaults: {
			resorts: [
                { id: '77', logo: 'https://www.breckenridge.com/Assets/images/sites/breckenridge/favicon.ico' },
                { id: '482', logo: 'https://www.vail.com/Assets/images/sites/vail/favicon.ico' },
                { id: '36', logo: 'https://www.beavercreek.com/Assets/images/sites/beavercreek/favicon.ico'}
            ],
            interval:   18000000 // Every 30 mins (50 api calls per day max)
        },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    start:  function() {
        Log.log('Starting module: ' + this.name);
        var self = this;

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        var resorts = '';
        for(i=0; i<this.config.resorts.length; i++) {
            resorts = resorts + this.config.resorts[i].id + ',';
        }
		this.url = 'https://api.onthesnow.com/api/v2/resort/snowreports?resortIds=' + resorts;
        this.powderInfo = [];

        // Trigger the first request
        this.getWeatherData(this);
        setInterval(function() {
            self.getWeatherData(self);
          }, self.config.interval);
    },

    getStyles: function() {
        return ['powder.css', 'font-awesome.css'];
    },


    getWeatherData: function(_this) {
        // Make the initial request to the helper then set up the timer to perform the updates
        _this.sendSocketNotification('GET-POWDER-FORECAST', _this.url);
    },

    convertCmToInches: function(cm) {
        var inches = cm / 2.54;
        inches = Math.round(inches);
        return inches;
    },

    getDom: function() {
        // Set up the local wrapper
        var wrapper = null;


        // If we have some data to display then build the results
        if (this.loaded) {
            wrapper = document.createElement('table');
	 	    wrapper.className = 'normal small';
            forecastRow = document.createElement('tr');
            var currentDay = moment().format('YYYY-MM-DD');
            const imgSize = '25';

            // Set up the forecast for three three days
            for (var i = 0; i < this.config.resorts.length; i++) {
                // Create the details for this day
                forcastDay = document.createElement('td');
                forcastDay.className = 'powderRow';

                forcastTitle = document.createElement('div');
                forcastTitle.className = 'powderTitle';
                forcastTitle.innerHTML = this.powderInfo[i].title;

                forecastIcon = document.createElement('img');
                forecastIcon.className = 'logoIcon';
                forecastIcon.setAttribute('height', '50');
                forecastIcon.setAttribute('width', '50');
                var result = this.config.resorts.find( ({ id }) => id === this.powderInfo[i].uuid );
                forecastIcon.src = result.logo;

//                forecastText = document.createElement('div');
//                forecastText.className = 'forecastText horizontalView bright';

                forecastBr = document.createElement('br');

                // Create div to hold all of the detail data
                forecastDetail = document.createElement('div');
                forecastDetail.className = 'powderRow';

                // Build up the details regarding current powder
                powderIcon = document.createElement('img');
                powderIcon.className = 'powderIcon';
                powderIcon.setAttribute('height', imgSize);
                powderIcon.setAttribute('width', imgSize);
                powderIcon.src = './modules/MMM-Powder/images/terrain.png';

                powderText = document.createElement('span');
                powderText.className = 'powderText2';
				powderText.innerHTML = this.convertCmToInches(this.powderInfo[i].snow.last24) + '&uml;';

                powderBr = document.createElement('br');

                // Build up the details regarding lifts
                liftIcon = document.createElement('img');
                liftIcon.className = 'powderIcon';
                liftIcon.setAttribute('height', imgSize);
                liftIcon.setAttribute('width', imgSize);
                liftIcon.src = './modules/MMM-Powder/images/lift.png';

                liftText = document.createElement('span');
                liftText.className = 'powderText2';
				let open = 0;
				if(this.powderInfo[i].lifts.open !== null){
					open = this.powderInfo[i].lifts.open;
				}
				liftText.innerHTML = open + ' / ' + this.powderInfo[i].lifts.total;

                liftBr = document.createElement('br');

                // Build up the details regarding runs
                runsIcon = document.createElement('img');
                runsIcon.className = 'powderIcon';
                runsIcon.setAttribute('height', imgSize);
                runsIcon.setAttribute('width', imgSize);
                runsIcon.src = './modules/MMM-Powder/images/runs.png';

                runsText = document.createElement('span');
                runsText.className = 'powderText2';
				if(this.powderInfo[i].runs.open !== null){
					open = this.powderInfo[i].runs.open;
				} else {
					open = 0;
				}
				runsText.innerHTML = open + ' / ' + this.powderInfo[i].runs.total;

                runsBr = document.createElement('br');

                // Build up the details regarding forecasted snow
                snowIcon = document.createElement('img');
                snowIcon.className = 'powderIcon';
                snowIcon.setAttribute('height', imgSize);
                snowIcon.setAttribute('width', imgSize);
                snowIcon.src = './modules/MMM-Powder/images/snow.png';

                snowText = document.createElement('table');
                snowText.className = 'powderText';
                const cellWidth = '30px';
                r = snowText.insertRow(0);
                c = r.insertCell(0);
                c.style.width = cellWidth;
                c.appendChild(snowIcon);
                c = r.insertCell(1);
                c.style.width = cellWidth;
                var nextDay = moment(currentDay).add(1, 'days').format("YYYY-MM-DD");
                result = this.powderInfo[i].forecast.find( ({ date }) => date === nextDay );
                c.innerHTML = this.convertCmToInches(result.snow) + '&uml;';
                c = r.insertCell(2);
                c.style.width = cellWidth;
                nextDay = moment(currentDay).add(2, 'days').format("YYYY-MM-DD");
                result = this.powderInfo[i].forecast.find( ({ date }) => date === nextDay );
                c.innerHTML = this.convertCmToInches(result.snow) + '&uml;';
                c = r.insertCell(3);
                c.style.width = cellWidth;
                nextDay = moment(currentDay).add(3, 'days').format("YYYY-MM-DD");
                result = this.powderInfo[i].forecast.find( ({ date }) => date === nextDay );
                c.innerHTML = this.convertCmToInches(result.snow) + '&uml;';

                // Now assemble the details
                forecastDetail.appendChild(powderIcon);
                forecastDetail.appendChild(powderText);
                forecastDetail.appendChild(powderBr);
                forecastDetail.appendChild(liftIcon);
                forecastDetail.appendChild(liftText);
                forecastDetail.appendChild(liftBr);
                forecastDetail.appendChild(runsIcon);
                forecastDetail.appendChild(runsText);
                forecastDetail.appendChild(runsBr);
//                forecastDetail.appendChild(snowIcon);
                forecastDetail.appendChild(snowText);

                forcastDay.appendChild(forcastTitle);
                forcastDay.appendChild(forecastIcon);
//                forcastDay.appendChild(forecastText);
                forcastDay.appendChild(forecastBr);
                forcastDay.appendChild(forecastDetail);

                // Now assemble the final output
                forecastRow.appendChild(forcastDay);
	            wrapper.appendChild(forecastRow);
			}
        } else {
            // Otherwise lets just use a simple div
            wrapper = document.createElement('div');
            wrapper.innerHTML = this.translate('LOADING');
        }

        return wrapper;
    },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-POWDER-FORECAST' && payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                if(payload.forecast.length > 0) {
                    this.loaded = true;
                    this.powderInfo = payload.forecast;
                }
                this.updateDom(1000);
            }
        }
    });
