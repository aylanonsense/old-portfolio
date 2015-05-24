$(document).ready(function() {
	//data
	var projects = <%= projects %>; //jshint ignore:line
	var tileSize = <%= tileSize %>; //jshint ignore:line

	//sort projects by size of the shape
	var projectsByShapeSize = projects.slice(0).sort(function(a, b) {
		return b.grid.area - a.grid.area;
	});

	//constants
	var MIN_COLUMNS = 4;
	var TILE_IMAGE_FADE_IN_TIME = 400;
	var TILE_IMAGE_FADE_DELAY = 1000;
	var TILE_IMAGE_FADE_OUT_TIME = 400;
	var TILE_RESIZE_DELAY = 250;
	var DIALOG_CONTENT_DEFAULT_WIDTH = 200;
	var DIALOG_CONTENT_DEFAULT_HEIGHT = 200;
	var DIALOG_FADE_IN_TIME = 200;
	var DIALOG_FADE_OUT_TIME = 200;
	var DIALOG_SWITCH_TIME = 600;
	var DIALOG_EXTRA_SWITCH_DIST = 600;

	//gather jQuery references to elements
	var body = $(document.body);
	var shapeContainer = $('#shapes');
	var dialogStuff = $('#dialog-stuff').hide();
	var leftArrow = dialogStuff.find('.left-arrow');
	var rightArrow = dialogStuff.find('.right-arrow');
	var dialogScreen = dialogStuff.find('.screen');
	var dialogs = [ "#dialog-0", "#dialog-1" ].map(function(selector) {
		var dialog = $(selector);
		return {
			ele: dialog,
			body: dialog.find('.body'),
			details: dialog.find('.details'),
			h2: dialog.find('h2'),
			title: dialog.find('.title'),
			timePeriod: dialog.find('.time-period'),
			h3: dialog.find('h3'),
			medium: dialog.find('.medium'),
			repoLink: dialog.find('.repo-link'),
			description: dialog.find('.description'),
			instructions: dialog.find('.instructions'),
			content: dialog.find('.content')
		};
	});
	projects.forEach(function(project) {
		project.shape = $('#shape-' + project.id);
	});

	//bind events when a shape is moused over or clicked
	projects.forEach(function(project) {
		var img = project.shape.find('img');
		var timer = null;
		project.shape
			//on hover, fade in the saturated/animated image
			.on('mouseenter', function() {
				if(timer) {
					clearTimeout(timer);
					timer = null;
				}
				img.stop().fadeTo(Math.floor(TILE_IMAGE_FADE_IN_TIME * (1.0 - +img.css('opacity'))), 1.0);
			})
			//when the mouse leaves the shape, fade out the saturated/animated image
			.on('mouseleave', function() {
				//it'd be nice to use the .delay() jQuery function, but it has a couple problems
				if(timer) {
					clearTimeout(timer);
					timer = null;
				}
				timer = setTimeout(function() {
					timer = null;
					img.fadeTo(TILE_IMAGE_FADE_OUT_TIME, 0.0);
				}, TILE_IMAGE_FADE_DELAY);
			})
			//when a shape is clicked, open the project dialog
			.on('click', function() {
				openDialog(project);
			});
	});

	//when you click in the dark area around the dialog, close the dialog
	$('.dialog, .dialog .body').on('click', function(evt) {
		if(evt.target === this) {
			closeDialog();
		}
	});

	//when the page is resized, we may need to reposition all of the shapes
	var resizeTimer = null;
	var timeOfLastResizeEvent = null;
	function resetResizeTimer(delay) {
		timeOfLastResizeEvent = null;
		resizeTimer = setTimeout(function() {
			if(timeOfLastResizeEvent === null) {
				resizeTimer = null;
				//page resizing has settled down -- reposition the shapes!
				repositionShapes();
			}
			else {
				resetResizeTimer(TILE_RESIZE_DELAY + timeOfLastResizeEvent - Date.now());
			}
		}, delay);
	}
	$(window).on('resize', function() {
		if(!resizeTimer) {
			resetResizeTimer(TILE_RESIZE_DELAY);
		}
		else {
			timeOfLastResizeEvent = Date.now();
		}
	});

	//reposition shapes such that they all fit together nice and pretty without any gaps
	var numColumnsCurrentlyRendered = null;
	function repositionShapes() {
		//figure out width of content area based on width of body
		var contentWidth = body.width();
		if(contentWidth > 600) {
			contentWidth = 600 + (contentWidth - 600) / 2;
		}
		//we only need to reposition the shapes if we change the number of columns displayed
		var numColumns = Math.max(MIN_COLUMNS, Math.floor((contentWidth - tileSize.margin) /
			(tileSize.width + tileSize.margin)));
		if(numColumnsCurrentlyRendered === numColumns) {
			return;
		}
		numColumnsCurrentlyRendered = numColumns;

		//resize body to make space for repositionEd shapes
		shapeContainer.width(numColumns * (tileSize.width + tileSize.margin));

		//let's create a grid of what tiles HAVE been filled so far
		var numRows = 1;
		var grid = {};
		for(var c = 0; c < numColumns; c++) {
			grid[c] = {};
		}

		//for each project/shape, find the earliest spot where it fits
		projectsByShapeSize.forEach(function(project) {
			//find a spot for the shape
			var tiles = project.grid.tiles;
			var position = findPositionForTiles(tiles, grid, numRows, numColumns);
			writeTilesIntoGrid(tiles, grid, position.row, position.col);
			var shapeHeight = tiles.length;
			numRows = Math.max(numRows, position.row + shapeHeight + 1);

			//move the shape
			project.shape.css({
				position: 'absolute',
				top: position.row * (tileSize.height + tileSize.margin),
				left: position.col * (tileSize.width + tileSize.margin)
			});
		});
	}
	function findPositionForTiles(tiles, grid, numRows, numColumns) {
		var shapeWidth = Math.max.apply(Math, tiles.map(function(row) { return row.length; }));
		var highScore = null;
		var highestScoringPosition = null;
		for(var r = 0; r <= numRows; r++) {
			for(var c = 0; c <= numColumns - shapeWidth; c++) {
				if(canFitTilesIntoGrid(tiles, grid, r, c)) {
					writeTilesIntoGrid(tiles, grid, r, c);
					var score = evaluateGrid(grid, numRows, numColumns);
					unwriteTilesFromGrid(tiles, grid, r, c);
					if(highScore === null || score > highScore) {
						highScore = score;
						highestScoringPosition = { row: r, col: c };
					}
				}
			}
		}
		//we return the best spot
		if(highestScoringPosition) {
			return highestScoringPosition;
		}
		//if we couldn't find a spot for the shape it means it's too wide to fit
		return { row: numRows, col: 0 };
	}
	function evaluateGrid(grid, numRows, numColumns) {
		var amountOfMess = 0;
		for(var c = 0; c < numColumns; c++) {
			var hasEncounteredFilledTile = false;
			for(var r = numRows; r >= 0; r--) {
				if(grid[c][r]) {
					hasEncounteredFilledTile = true;
				}
				else {
					amountOfMess += (hasEncounteredFilledTile ? 2 : 1) * (numRows - r);
				}
			}
		}
		return -amountOfMess;
	}
	function canFitTilesIntoGrid(tiles, grid, row, col) {
		//the tiles only fit if all of the grid's spaces they would go in are empty
		for(var r = 0; r < tiles.length; r++) {
			for(var c = 0; c < tiles[r].length; c++) {
				if(tiles[r][c] !== ' ' && grid[col + c][row + r]) {
					return false;
				}
			}
		}
		return true;
	}
	function writeTilesIntoGrid(tiles, grid, row, col) {
		//if the tiles do fit, mark them off in the grid as no longer being empty
		for(var r = 0; r < tiles.length; r++) {
			for(var c = 0; c < tiles[r].length; c++) {
				//make sure the tiles can fit
				if(tiles[r][c] !== ' ') {
					grid[col + c][row + r] = true;
				}
			}
		}
	}
	function unwriteTilesFromGrid(tiles, grid, row, col) {
		for(var r = 0; r < tiles.length; r++) {
			for(var c = 0; c < tiles[r].length; c++) {
				//make sure the tiles can fit
				if(tiles[r][c] !== ' ') {
					grid[col + c][row + r] = false;
				}
			}
		}
	}

	//when the left/right buttons are pressed, we move to the previous/next project
	leftArrow.on('click', function() {
		//switch to previous project
		var len = projects.length;
		switchDialog(projects[(getIndexOfProject(activeDialogProject) + len - 1) % len], 'left');
	});
	rightArrow.on('click', function() {
		//switch to next project
		switchDialog(projects[(getIndexOfProject(activeDialogProject) + 1) % projects.length], 'right');
	});
	function getIndexOfProject(project) {
		for(var i = 0; i < projects.length; i++) {
			if(projects[i].id === project.id) {
				return i;
			}
		}
	}

	//open the dialog and display a particular project
	var dialogState = 'closed';
	var activeDialogProject = null;
	var activeDialogIndex = 0;
	function openDialog(project) {
		if(dialogState === 'closed') {
			dialogState = 'opening';
			activeDialogProject = project;

			//you can't scroll while the dialog is opened/opening
			body.addClass('no-scroll');

			//hide all them dialogs to start
			dialogs.forEach(hideDialog);

			//position the active dialog and show it
			activeDialogIndex = 0;
			var activeDialog = dialogs[activeDialogIndex];
			positionDialogInCenterOfScreen(activeDialog);
			showDialog(activeDialog);

			//load the data into the dialog
			preloadProjectIntoDialog(project, activeDialog);

			//open the dialog
			dialogStuff.show().fadeTo(DIALOG_FADE_IN_TIME, 1.0, function() {
				//fill in the content area only after the dialog is fully visible
				loadContentIntoDialog(project, activeDialog);
				dialogState = 'open';
			});
		}
	}
	function closeDialog() {
		if(dialogState === 'open') {
			dialogState = 'closing';
			activeDialogProject = null;
			dialogStuff.fadeTo(DIALOG_FADE_OUT_TIME, 0.0, function() {
				dialogStuff.hide();
				emptyDialogContent(dialogs[activeDialogIndex]);
				body.removeClass('no-scroll');
				dialogState = 'closed';
			});
		}
	}
	function switchDialog(project, dir) {
		if(dialogState === 'open') {
			dialogState = 'switching';
			activeDialogProject = project;

			//move the active dialog off to the side
			var oldActiveDialog = dialogs[activeDialogIndex];
			slideDialogOffScreen(oldActiveDialog, (dir === 'left' ? 'right' : 'left'), function() {
				hideDialog(oldActiveDialog);
				emptyDialogContent(oldActiveDialog);
			});

			//find the next active dialog
			activeDialogIndex = 1 - activeDialogIndex;
			var newActiveDialog = dialogs[activeDialogIndex];

			//slide it onto screen
			preloadProjectIntoDialog(project, newActiveDialog);
			positionDialogOffScreen(newActiveDialog, dir);
			showDialog(newActiveDialog);
			slideDialogToCenterOfScreen(newActiveDialog, function() {
				loadContentIntoDialog(project, newActiveDialog);
				dialogState = 'open';
			});
		}
	}

	//dialog helper functions
	function preloadProjectIntoDialog(project, dialog) {
		//resize the content area to fit the content that will be there
		dialog.content.css({
			width: project.content.width || DIALOG_CONTENT_DEFAULT_WIDTH,
			height: project.content.height || DIALOG_CONTENT_DEFAULT_HEIGHT
		});
		//fill out the details
		dialog.title.toggle(project.title !== null).text(project.title);
		dialog.timePeriod.toggle(project.timePeriod !== null).text("(" + project.timePeriod + ")");
		dialog.h2.toggle(project.title !== null || project.timePeriod !== null);
		dialog.medium.toggle(project.medium !== null).text(project.medium);
		dialog.repoLink.toggle(project.repoUrl !== null).attr('href', project.repoUrl);
		dialog.h2.toggle(project.medium !== null || project.repoUrl !== null);
		dialog.description.toggle(project.description !== null).html(project.description);
		dialog.instructions.toggle(project.instructions !== null).html(project.instructions);
	}
	function loadContentIntoDialog(project, dialog) {
		if(project.content.type === 'iframe') {
			var width = project.content.width;
			var height = project.content.height;
			var x = project.content.x;
			var y = project.content.y;
			$('<div style="overflow: hidden;' +
				'width: ' + width + 'px; ' +
				'height: ' + height + 'px;">' +
					'<iframe ' +
						'src="' + project.content.url +'" ' +
						'width="' + (x + width) + 'px" ' +
						'height="' + (y + height) + 'px" ' +
						'frameborder="0" ' +
						'scrolling="no" ' +
						'style="margin-left:' + (-x) + 'px;margin-top:' + (-y) + 'px;"' +
						'></iframe>' +
				'</div>')
				.appendTo(dialog.content).find('iframe').focus();
		}
	}
	function positionDialogInCenterOfScreen(dialog) {
		dialog.body.css('left', 0);
	}
	function positionDialogOffScreen(dialog, dir) {
		var dist = body.width() / 2 + DIALOG_EXTRA_SWITCH_DIST;
		dialog.body.css('left', (dir === 'left' ? -dist : dist));
	}
	function slideDialogOffScreen(dialog, dir, callback) {
		var dist = body.width() / 2 + DIALOG_EXTRA_SWITCH_DIST;
		dialog.body.animate({
			left: (dir === 'left' ? -dist : dist)
		}, DIALOG_SWITCH_TIME, callback);
	}
	function slideDialogToCenterOfScreen(dialog, callback) {
		dialog.body.animate({ left: 0 }, DIALOG_SWITCH_TIME, callback);
	}
	function showDialog(dialog) {
		dialog.ele.show();
	}
	function hideDialog(dialog) {
		dialog.ele.hide();
	}
	function emptyDialogContent(dialog) {
		dialog.content.empty();
	}

	//when the page loads we reposition shapes into a grid immediately
	repositionShapes();
});