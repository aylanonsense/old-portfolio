module.exports = [
	{
		id: "grapple-game",
		title: "Grapple game",
		timePeriod: "June 2014 to March 2015",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/grapple-game",
		description: "A platformer featuring grappling hooks.",
		instructions: "Left/Right: move, Space: jump, Click: shoot grapple, Shift: pull grapple",
		grid: {
			previewImageUrl: "/img/grapple-game/grey.gif",
			imageUrl: "/img/grapple-game/animated.gif",
			tiles: ["XXXX","XXXX","XXXX","XXXX","XXXX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3011/",
			width: 700,
			height: 500,
			x: 50,
			y: 50
		}
	}, {
		id: "sketch-world",
		title: "Sketch World",
		timePeriod: "March 2015",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/sketch-world",
		description: "A multiplayer 2D platformer with a persistent player-created world.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/sketch-world/grey.gif",
			imageUrl: "/img/sketch-world/animated.gif",
			tiles: ["XXXXXX","XXXXXX","XXXXXX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3012/",
			width: 700,
			height: 500,
			x: 0,
			y: 15
		}
	}, {
		id: "processing-sketchbook",
		title: "Processing sketchbook",
		timePeriod: "February 2015",
		medium: "Processing",
		repoUrl: "https://github.com/bridgs/processing-sketchbook",
		description: "Some doodles to get acquainted with Processing.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/processing-sketchbook/grey.gif",
			imageUrl: "/img/processing-sketchbook/animated.gif",
			tiles: ["XX","XX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3010/",
			width: 800,
			height: 600,
			x: 7,
			y: 3
		}
	}, {
		id: "breakout-ball",
		title: "Breakout Ball",
		timePeriod: "January 2015",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/breakout-ball",
		description: "Testing frame-by-frame hitboxes to see how that would feel.",
		instructions: "Left/Right: move, Space: jump, Z: swing",
		grid: {
			previewImageUrl: "/img/breakout-ball/grey.gif",
			imageUrl: "/img/breakout-ball/animated.gif",
			tiles: ["XXX","XXX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3007/",
			width: 600,
			height: 450,
			x: 0,
			y: 15
		}
	}, {
		id: "paradox-anomaly",
		title: "Paradox: Anomaly",
		timePeriod: "December 2014",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/paradox-anomaly",
		description: "A tile-based puzzle game invovling time travel. The final product would revolve around solving puzzles while avoiding paradoxes that would be caused by interfering with your past self.",
		instructions: "WASD: move, Z: use/drop item, X: return to the past",
		grid: {
			previewImageUrl: "/img/paradox-anomaly/grey.gif",
			imageUrl: "/img/paradox-anomaly/animated.gif",
			tiles: ["XXXX","XXXX","XXXX","XXXX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3005/",
			width: 640,
			height: 500,
			x: 80,
			y: 50
		}
	}, {
		id: "boss-rush-game",
		title: "Boss rush game",
		timePeriod: "August to November 2014",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/boss-rush-game",
		description: "A platformer intended to be a sequence of boss fights. Only one was fully programmed (with another, a fire queen, in development).",
		instructions: "Left/Right: move, Space: jump, A: shoot",
		grid: {
			previewImageUrl: "/img/boss-rush-game/grey.gif",
			imageUrl: "/img/boss-rush-game/animated.gif",
			tiles: ["XXXXX","XXXXX","XXXXX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3003/",
			width: 800,
			height: 570,
			x: 0,
			y: 0
		}
	}, {
		id: "space-team-galaxy-explorer",
		title: "Space Team: Galaxy Explorer",
		timePeriod: "November 2014",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/space-team-galaxy-explorer",
		description: "A multiplayer spaceship simulator. The end product would give each player their own dashboard and controls for specific parts of the ship as it hurtled through space.",
		instructions: "Control thrusters with mouse",
		grid: {
			previewImageUrl: "/img/space-team-galaxy-explorer/grey.gif",
			imageUrl: "/img/space-team-galaxy-explorer/animated.gif",
			tiles: ["XXXXX","XXXXX","XXXXX","XXXXX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3008/",
			width: 660,
			height: 430,
			x: 20,
			y: 40
		}
	}, {
		id: "minisnake",
		title: "minisnake",
		timePeriod: "September 2014",
		medium: "JavaScript",
		repoUrl: "https://github.com/bridgs/minisnake",
		description: "An exercise in <a href=\"http://en.wikipedia.org/wiki/Code_golf\" target=\"_blank\">code golf</a>. The goal was to implement a minimalist version of Snake in the fewest characters possible. The version above is 623 characters minified.",
		instructions: "Arrow keys: move",
		grid: {
			previewImageUrl: "/img/minisnake/grey.gif",
			imageUrl: "/img/minisnake/animated.gif",
			tiles: ["XXX"]
		},
		content: {
			type: "iframe",
			url: "/repos/minisnake/minisnake.min.html",
			width: 400,
			height: 400,
			x: 8,
			y: 9
		}
	}, {
		id: "spider-game",
		title: "Spider game",
		timePeriod: "September 2014",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/spider-game",
		description: "A simple spider web simulation thrown together during a family vacation.",
		instructions: "WASD: move, Shift: lay web",
		grid: {
			previewImageUrl: "/img/spider-game/grey.gif",
			imageUrl: "/img/spider-game/animated.gif",
			tiles: ["XX","XX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3004/",
			width: 450,
			height: 450,
			x: 0,
			y: 0
		}
	},  {
		id: "archery-game",
		title: "Archery game",
		timePeriod: "May 2014",
		medium: "Node.js, WebGL",
		repoUrl: "https://github.com/bridgs/archery-game",
		description: "First foray into WebGL, the cylindrical player model is able to shoot arrows at varying speeds and distances.",
		instructions: "WASD: move, Click and drag player: fire arrow, C: change camera",
		grid: {
			previewImageUrl: "/img/archery-game/grey.gif",
			imageUrl: "/img/archery-game/animated.gif",
			tiles: ["XX","XX","XX","XX","XX","XX","XX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3006/",
			width: 500,
			height: 500,
			x: 0,
			y: 0
		}
	}, {
		id: "tranquilime",
		title: "tranquilime",
		timePeriod: "September 2013",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/tranquilime",
		description: "Code4Health 2013 hackathon submission. Our team of two created a site for giving comfort to those in need. The final version would have pulled requests for comfort from Twitter and posted the responses anonymously.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/tranquilime/grey.gif",
			imageUrl: "/img/tranquilime/animated.gif",
			tiles: ["XXXX","XXXX"]
		},
		content: {
			type: "iframe",
			url: "http://tranquili.me/",
			width: 700,
			height: 400,
			x: 0,
			y: 0
		}
	}, {
		id: "sticky-wiki",
		title: "Sticky Wiki",
		timePeriod: "September 2013",
		medium: "Node.js, SVG",
		repoUrl: "https://github.com/bridgs/sticky-wiki",
		description: "A virtual message board.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/sticky-wiki/grey.gif",
			imageUrl: "/img/sticky-wiki/animated.gif",
			tiles: ["XX","XX","XX","XX"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3002/",
			width: 800,
			height: 600,
			x: 0,
			y: 0
		}
	}, {
		id: "alchemy-drop",
		title: "Alchemy Drop",
		timePeriod: "September 2013",
		medium: "Node.js",
		repoUrl: "https://github.com/bridgs/alchemy-drop",
		description: "Non-interactive concepts for a block puzzler. The goal was to make a game where as soon as you cleared any tiles, new tiles would be added in such a way that the combo would continue forever.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/alchemy-drop/grey.gif",
			imageUrl: "/img/alchemy-drop/animated.gif",
			tiles: ["X","X","X"]
		},
		content: {
			type: "iframe",
			url: "http://brid.gs:3009/",
			width: 500,
			height: 500,
			x: 10,
			y: 80
		}
	}, {
		id: "zombie-aflockalypse",
		title: "Zombie Aflockalypse",
		timePeriod: "2009",
		medium: "ActionScript",
		repoUrl: null,
		description: "College submission for a flocking simulation. The zombies (green dots) are programmed to seek out humans (blue dots) while the humans are programmed to stick together and avoid zombies.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/zombie-aflockalypse/grey.gif",
			imageUrl: "/img/zombie-aflockalypse/animated.gif",
			tiles: ["XXX","XXX","XXX"]
		},
		content: {
			type: "iframe",
			url: "/repos/zombie-aflockalypse/zombie-aflockalypse.swf",
			width: 600,
			height: 450,
			x: 0,
			y: 0
		}
	}, {
		id: "hex-game",
		title: "Hex game",
		timePeriod: "2009",
		medium: "ActionScript",
		repoUrl: null,
		description: "A little hex world with customizable terrain.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/hex-game/grey.gif",
			imageUrl: "/img/hex-game/animated.gif",
			tiles: ["XX"]
		},
		content: {
			type: "iframe",
			url: "/repos/hex-game/hex-game.swf",
			width: 500,
			height: 400,
			x: 0,
			y: 0
		}
	}, {
		id: "blob-animation",
		title: "Untitled",
		timePeriod: "2007",
		medium: "Flash",
		repoUrl: null,
		description: "Random doodle of a blob.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/blob-animation/grey.gif",
			imageUrl: "/img/blob-animation/animated.gif",
			tiles: ["X"]
		},
		content: {
			type: "iframe",
			url: "/repos/blob-animation/blob-animation.swf",
			width: 350,
			height: 350,
			x: 0,
			y: 0
		}
	}, {
		id: "phys-engine",
		title: "Untitled",
		timePeriod: "2006",
		medium: "ActionScript",
		repoUrl: null,
		description: "The beginnings of my first ever physics engine.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/phys-engine/grey.gif",
			imageUrl: "/img/phys-engine/animated.gif",
			tiles: ["X","X"]
		},
		content: {
			type: "iframe",
			url: "/repos/phys-engine/phys-engine.swf",
			width: 495,
			height: 450,
			x: 0,
			y: 0
		}
	}, {
		id: "efflorescence",
		title: "Efflorescence",
		timePeriod: "2005",
		medium: "ActionScript",
		repoUrl: null,
		description: "An extremely esoteric math game.",
		instructions: "Click stems of fruit to... do a whole bunch of stuff",
		grid: {
			previewImageUrl: "/img/efflorescence/grey.gif",
			imageUrl: "/img/efflorescence/animated.gif",
			tiles: ["XX","XX"]
		},
		content: {
			type: "iframe",
			url: "/repos/efflorescence/efflorescence.swf",
			width: 700,
			height: 350,
			x: 0,
			y: 0
		}
	}, {
		id: "mindsweeper",
		title: "Mindsweeper",
		timePeriod: "2005",
		medium: "ActionScript",
		repoUrl: null,
		description: "An experimental take on Minesweeper for <a href=\"http://playwithyourmind.com/\" target=\"_blank\">Play With Your Mind</a>.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/mindsweeper/grey.gif",
			imageUrl: "/img/mindsweeper/animated.gif",
			tiles: ["XX","XX"]
		},
		content: {
			type: "iframe",
			url: "/repos/mindsweeper/mindsweeper.swf",
			width: 495,
			height: 450,
			x: 0,
			y: 0
		}
	}, {
		id: "virtual-pet",
		title: "Virtual Pet",
		timePeriod: "2004",
		medium: "ActionScript",
		repoUrl: null,
		description: "Animation test for a virtual pet game.",
		instructions: null,
		grid: {
			previewImageUrl: "/img/virtual-pet/grey.gif",
			imageUrl: "/img/virtual-pet/animated.gif",
			tiles: ["XX","XX","XX","XX"]
		},
		content: {
			type: "iframe",
			url: "/repos/virtual-pet/virtual-pet.swf",
			width: 600,
			height: 450,
			x: 0,
			y: 0
		}
	}
];