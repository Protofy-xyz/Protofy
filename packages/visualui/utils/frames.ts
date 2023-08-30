const frames = {
    'ipad11-horizontal': {
        mode: 'horizontal',
        source: '/apple-ipad-pro-11-silver.png',
        marginTop: 100,
        widthRatio: 1.081,
        heightRatio: 1.115,
        frameRatio: 24,
        zoom: 1,
        radiusRatio: 70,
        scrollbar: `/* total width */
		#editor::-webkit-scrollbar {
			background-color:transparent;
			width:16px
		}
		
		/* background of the scrollbar except button or resizer */
		#editor::-webkit-scrollbar-track {
			opacity: 0
		}
		
		/* scrollbar itself */
		#editor::-webkit-scrollbar-thumb {
			background-color:#babac0;
			border-radius:16px;
			border:5px solid #f0f0f0
		}
		#editor::-webkit-scrollbar-thumb:hover {
			background-color:#a0a0a5;
			border:5px solid #f4f4f4
		}
		
		#editor::-webkit-scrollbar-button {display:none}`
    },
    'ipad11-vertical': {
        mode: 'vertical',
        source: require('../assets/frames/apple-ipad-pro-11-silver-vertical.png'),
        marginTop: 100,
        widthRatio: 1.100,
        heightRatio: 1.070,
        frameRatio: 20,
        zoom: 1,
        radiusRatio: 30,
        scrollbar: `/* total width */
		#editor::-webkit-scrollbar {
			background-color:transparent;
			width:13px
		}
		
		/* background of the scrollbar except button or resizer */
		#editor::-webkit-scrollbar-track {
			opacity: 0
		}
		
		/* scrollbar itself */
		#editor::-webkit-scrollbar-thumb {
			background-color:#babac0;
			border-radius:16px;
			border:3px solid #f0f0f0
		}
		#editor::-webkit-scrollbar-thumb:hover {
			background-color:#a0a0a5;
			border:3px solid #f4f4f4
		}

		/* Adds margin bottom and top to not exceed frame */
		#editor::-webkit-scrollbar-track-piece:end {
			background: transparent;
			margin-bottom: 4px; 
		}
		#editor::-webkit-scrollbar-track-piece:start {
			background: transparent;
			margin-top: 4px;
		}

		#editor::-webkit-scrollbar-button {display:none}`
    },
    'iphone13-vertical': {
        mode: 'vertical',
        source: require('../assets/frames/apple-iphone-pro-13-silver-vertical.png'),
        marginTop: 100,
        widthRatio: 1.115,
        heightRatio: 1.045,
        frameRatio: 20,
        radiusRatio: 9,
        zoom: 1,
        scrollbar: `/* total width */
		#editor::-webkit-scrollbar {
			background-color:transparent;
			width:16px
		}
		
		/* background of the scrollbar except button or resizer */
		#editor::-webkit-scrollbar-track {
			opacity: 0
		}
		
		/* scrollbar itself */
		#editor::-webkit-scrollbar-thumb {
			background-color:#babac0;
			border-radius:16px;
			border:5px solid #f0f0f0
		}
		#editor::-webkit-scrollbar-thumb:hover {
			background-color:#a0a0a5;
			border:5px solid #f4f4f4
		}

		/* Adds margin bottom and top to not exceed frame */
		#editor::-webkit-scrollbar-track-piece:end {
			background: transparent;
			margin-bottom: 19px; 
		}
		#editor::-webkit-scrollbar-track-piece:start {
			background: transparent;
			margin-top: 19px;
		}
		
		#editor::-webkit-scrollbar-button {display:none}`
    },
    'iphone13-horizontal': {
        mode: 'horizontal',
        source: require('../assets/frames/apple-iphone-pro-13-silver-horizontal.png'),
        marginTop: 100,
        widthRatio: 1.045,
        heightRatio: 1.120,
        frameRatio: 37,
        radiusRatio: 18,
        zoom: 1,
        scrollbar: `/* total width */
		#editor::-webkit-scrollbar {
			background-color:transparent;
			width:16px
		}
		
		/* background of the scrollbar except button or resizer */
		#editor::-webkit-scrollbar-track {
			opacity: 0
		}
		
		/* scrollbar itself */
		#editor::-webkit-scrollbar-thumb {
			background-color:#babac0;
			border-radius:16px;
			border:5px solid #f0f0f0
		}
		#editor::-webkit-scrollbar-thumb:hover {
			background-color:#a0a0a5;
			border:5px solid #f4f4f4
		}

		/* Adds margin bottom and top to not exceed frame */
		#editor::-webkit-scrollbar-track-piece:end {
			background: transparent;
			margin-bottom: 19px; 
		}
		#editor::-webkit-scrollbar-track-piece:start {
			background: transparent;
			margin-top: 19px;
		}
		
		#editor::-webkit-scrollbar-button {display:none}`
    },
	'monitor': {
        mode: 'horizontal',
        source: require('../assets/frames/monitor-24inch-silver.png'),
        marginTop: 100,
        widthRatio: 1.055,
        heightRatio: 1.200,
        frameRatio: 21,
        zoom: 1,
        radiusRatio: 500,
        scrollbar: `/* total width */
		#editor::-webkit-scrollbar {
			background-color:transparent;
			width:16px
		}
		
		/* background of the scrollbar except button or resizer */
		#editor::-webkit-scrollbar-track {
			opacity: 0
		}
		
		/* scrollbar itself */
		#editor::-webkit-scrollbar-thumb {
			background-color:#babac0;
			border-radius:16px;
			border:5px solid #f0f0f0
		}
		#editor::-webkit-scrollbar-thumb:hover {
			background-color:#a0a0a5;
			border:5px solid #f4f4f4
		}
		
		#editor::-webkit-scrollbar-button {display:none}`
    },
	'raspi-display-horizontal': {
        mode: 'horizontal',
        source: require('../assets/frames/raspi-display-horizontal.png'),
        marginTop: 100,
        widthRatio: 1.260,
        heightRatio: 1.290,
        frameRatio: 13,
        zoom: 1,
        radiusRatio: 500,
        scrollbar: `/* total width */
		#editor::-webkit-scrollbar {
			background-color:transparent;
			width:16px
		}
		
		/* background of the scrollbar except button or resizer */
		#editor::-webkit-scrollbar-track {
			opacity: 0
		}
		
		/* scrollbar itself */
		#editor::-webkit-scrollbar-thumb {
			background-color:#babac0;
			border-radius:16px;
			border:5px solid #f0f0f0
		}
		#editor::-webkit-scrollbar-thumb:hover {
			background-color:#a0a0a5;
			border:5px solid #f4f4f4
		}
		
		#editor::-webkit-scrollbar-button {display:none}`
    },
	'raspi-display-vertical': {
        mode: 'vertical',
        source: require('../assets/frames/raspi-display-vertical.png'),
        marginTop: 100,
        widthRatio: 1.290,
        heightRatio: 1.250,
        frameRatio: 4.5,
        zoom: 1,
        radiusRatio: 500,
        scrollbar: `/* total width */
		#editor::-webkit-scrollbar {
			background-color:transparent;
			width:16px
		}
		
		/* background of the scrollbar except button or resizer */
		#editor::-webkit-scrollbar-track {
			opacity: 0
		}
		
		/* scrollbar itself */
		#editor::-webkit-scrollbar-thumb {
			background-color:#babac0;
			border-radius:16px;
			border:5px solid #f0f0f0
		}
		#editor::-webkit-scrollbar-thumb:hover {
			background-color:#a0a0a5;
			border:5px solid #f4f4f4
		}
		
		#editor::-webkit-scrollbar-button {display:none}`
    }
}

export {frames}