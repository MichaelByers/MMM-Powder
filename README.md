# MMM-Powder
Get snow and powder info for my ski resorts

Uses OnTheSnow api.

Just need to get the resort ID, and a link to the resort logo
```
	defaults: {
			resorts: [
                { id: '77', logo: 'https://www.breckenridge.com/Assets/images/sites/breckenridge/favicon.ico' },
                { id: '482', logo: 'https://www.vail.com/Assets/images/sites/vail/favicon.ico' },
                { id: '36', logo: 'https://www.beavercreek.com/Assets/images/sites/beavercreek/favicon.ico'}
            ],
            interval:   18000000 // Every 30 mins (50 api calls per day max)
        },
```
