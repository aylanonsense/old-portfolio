$(document).ready(function() {
	//data
	var projects = <%= projects %>; //jshint ignore:line
	var tileSize = <%= tileSize %>; //jshint ignore:line

	//constants
	var MIN_COLUMNS = 4;
	var RESIZE_DELAY = 250;
	var DEFAULT_DIALOG_CONTENT_AREA_WIDTH = 200;
	var DEFAULT_DIALOG_CONTENT_AREA_HEIGHT = 200;
	var DIALOG_FADE_IN_TIME = 200;
	var DIALOG_FADE_OUT_TIME = 200;
	var DIALOG_SWITCH_FADE_OUT_TIME = 300;
	var DIALOG_SWITCH_FADE_IN_TIME = 300;
	var IMAGE_FADE_IN_TIME = 500;
	var IMAGE_FADE_OUT_TIME = 500;

	//gather jQuery references to elements
	var body = $(document.body);
	var shapeContainer = $('#shapes');
	var dialog = $('#dialog').hide();
	var leftArrow = dialog.find('.left-arrow');
	var rightArrow = dialog.find('.right-arrow');
	var dialogScreen = dialog.find('.screen');
	var dialogDetails = dialog.find('.details');
	var dialogTitle = dialog.find('h2');
	var dialogDescription = dialog.find('.description');
	var dialogMedium = dialog.find('.medium');
	var dialogTimePeriod = dialog.find('.time-period');
	var dialogRepoLink = dialog.find('.repo-link');
	var dialogContentArea = dialog.find('.content-area');
	projects.forEach(function(project) {
		project.shape = $('#shape-' + project.id);
	});

	//bind events when a shape is moused over or clicked
	projects.forEach(function(project) {
		var img = project.shape.find('img');
		project.shape
			//on hover, fade in the saturated/animated image
			.on('mouseenter', function() {
				img.stop().fadeTo(Math.floor(IMAGE_FADE_IN_TIME * (1.0 - +img.css('opacity'))), 1.0);
			})
			//when the mouse leaves the shape, fade out the saturated/animated image
			.on('mouseleave', function() {
				img.stop().fadeTo(Math.floor(IMAGE_FADE_OUT_TIME * +img.css('opacity')), 0.0);
			})
			//when a shape is clicked, open the project dialog
			.on('click', function() {
				openDialog(project);
			});
	});

	//when you click in the dark area around the dialog, close the dialog
	dialogScreen.on('click', function() {
		closeDialog();
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
				resetResizeTimer(RESIZE_DELAY + timeOfLastResizeEvent - Date.now());
			}
		}, delay);
	}
	$(window).on('resize', function() {
		if(!resizeTimer) {
			resetResizeTimer(RESIZE_DELAY);
		}
		else {
			timeOfLastResizeEvent = Date.now();
		}
	});

	//reposition shapes such that they all fit together nice and pretty without any gaps
	var numColumnsCurrentlyRendered = null;
	function repositionShapes() {
		//we only need to reposition the shapes if we change the number of columns displayed
		var numColumns = Math.max(MIN_COLUMNS, Math.floor((body.width() - tileSize.margin) /
			(tileSize.width + tileSize.margin)));
		if(numColumnsCurrentlyRendered === numColumns) {
			return;
		}
		numColumnsCurrentlyRendered = numColumns;

		//resize body to make space for repositionEd shapes
		shapeContainer.width(tileSize.margin + numColumns * (tileSize.width + tileSize.margin));

		//let's create a grid of what tiles HAVE been filled so far
		var numRows = 1;
		var grid = {};
		for(var c = 0; c < numColumns; c++) {
			grid[c] = {};
		}

		//for each project/shape, find the earliest spot where it fits
		for(var i = 0; i < projects.length; i++) {
			//find a spot for the shape
			var tiles = projects[i].grid.tiles;
			var position = findPositionForTiles(tiles, grid, numRows, numColumns);
			var shapeHeight = tiles.length;
			numRows = Math.max(numRows, position.row + shapeHeight + 1);

			//move the shape
			projects[i].shape.css({
				position: 'absolute',
				top: position.row * tileSize.height + (position.row - 1) * tileSize.margin,
				left: position.col * tileSize.width + (position.col - 1) * tileSize.margin
			});
		}
	}
	function findPositionForTiles(tiles, grid, numRows, numColumns) {
		var shapeWidth = Math.max.apply(Math, tiles.map(function(row) { return row.length; }));
		for(var r = 0; r <= numRows; r++) {
			for(var c = 0; c <= numColumns - shapeWidth; c++) {
				if(tryToFitTilesIntoPosition(tiles, grid, r, c)) {
					return { row: r, col: c };
				}
			}
		}
		//if we couldn't find a spot for the shape it means it's too wide to fit
		return { row: numRows, col: 0 };
	}
	function tryToFitTilesIntoPosition(tiles, grid, row, col) {
		var r, c;
		//the tiles only fit if all of the grid's spaces they would go in are empty
		for(r = 0; r < tiles.length; r++) {
			for(c = 0; c < tiles[r].length; c++) {
				if(tiles[r][c] !== ' ' && grid[col + c][row + r]) {
					return false;
				}
			}
		}
		//if the tiles do fit, mark them off in the grid as no longer being empty
		for(r = 0; r < tiles.length; r++) {
			for(c = 0; c < tiles[r].length; c++) {
				//make sure the tiles can fit
				if(tiles[r][c] !== ' ') {
					grid[col + c][row + r] = true;
				}
			}
		}
		return true;
	}

	//open the dialog and display a particular project
	var dialogState = 'closed';
	var openedProject = null;
	function openDialog(project) {
		if(dialogState === 'closed') {
			dialogState = 'opening';
			openedProject = project;

			//you can't scroll while the dialog is opened (or opening);
			body.addClass('no-scroll');

			//populate the dialog with the project data
			populateDialogDetails(project);

			//resize the content area to fit the content that will be there
			dialogContentArea.css({
				width: project.content.width || DEFAULT_DIALOG_CONTENT_AREA_WIDTH,
				height: project.content.height || DEFAULT_DIALOG_CONTENT_AREA_HEIGHT
			});

			//open the dialog
			dialog.css('display', 'flex').fadeTo(DIALOG_FADE_IN_TIME, 1.0, function() {
				dialogState = 'open';

				//fill in the content area only after the dialog is fully visible
				if(project.content.type === 'iframe') {
					$('<iframe ' +
						'src="' + project.content.url +'" ' +
						'width="' + project.content.width + 'px" ' +
						'height="' + project.content.height + 'px" ' +
						'frameborder="0" ' +
						'scrolling="no" ' +
						'></iframe>')
						.appendTo(dialogContentArea).focus();
				}
			});
		}
	}
	function closeDialog() {
		if(dialogState === 'open') {
			dialogState = 'closing';
			openedProject = null;
			dialog.fadeTo(DIALOG_FADE_OUT_TIME, 0.0, function() {
				dialog.hide();
				dialogContentArea.empty();
				body.removeClass('no-scroll');
				dialogState = 'closed';
			});
		}
	}

	//when the left/right buttons are pressed, we move to the previous/next project
	leftArrow.on('click', function() {
		switchToPreviousProject();
	});
	rightArrow.on('click', function() {
		switchToNextProject();
	});
	function getIndexOfProject(project) {
		for(var i = 0; i < projects.length; i++) {
			if(projects[i].id === project.id) {
				return i;
			}
		}
	}
	function switchToPreviousProject() {
		var len = projects.length;
		switchDialog(projects[(getIndexOfProject(openedProject) + len - 1) % len]);
	}
	function switchToNextProject() {
		switchDialog(projects[(getIndexOfProject(openedProject) + 1) % projects.length]);
	}
	function switchDialog(project) {
		if(dialogState === 'open') {
			dialogState = 'switching';
			openedProject = project;

			//resize the content area to fit the content that will be there
			dialogContentArea.empty().animate({
				width: project.content.width || DEFAULT_DIALOG_CONTENT_AREA_WIDTH,
				height: project.content.height || DEFAULT_DIALOG_CONTENT_AREA_HEIGHT
			}, DIALOG_SWITCH_FADE_OUT_TIME + DIALOG_SWITCH_FADE_IN_TIME);

			//fade out the existing details
			dialogDetails.fadeTo(DIALOG_SWITCH_FADE_OUT_TIME, 0.0, function() {
				//populate the dialog with the new project data
				populateDialogDetails(project);

				//fade the details back in
				dialogDetails.fadeTo(DIALOG_SWITCH_FADE_IN_TIME, 1.0, function() {
					dialogState = 'open';
				});
			});

			/*//resize the content area to fit the content that will be there
			dialogContentArea.animate({
				width: project.content.width || DEFAULT_DIALOG_CONTENT_AREA_WIDTH,
				height: project.content.height || DEFAULT_DIALOG_CONTENT_AREA_HEIGHT
			}, DIALOG_SWITCH_TIME);

			//open the dialog
			dialog.css('display', 'flex').fadeTo(DIALOG_FADE_IN_TIME, 1.0, function() {
				dialogState = 'open';

				//fill in the content area only after the dialog is fully visible
				if(project.content.type === 'iframe') {
					$('<iframe ' +
						'src="' + project.content.url +'" ' +
						'width="' + project.content.width + 'px" ' +
						'height="' + project.content.height + 'px" ' +
						'frameborder="0" ' +
						'scrolling="no" ' +
						'></iframe>')
						.appendTo(dialogContentArea).focus();
				}
			});*/
		}
	}
	function populateDialogDetails(project) {
		dialogTitle.toggle(project.title !== null).text(project.title);
		dialogDescription.toggle(project.description !== null).text(project.description);
		dialogMedium.toggle(project.medium !== null).text(project.medium);
		dialogTimePeriod.toggle(project.timePeriod !== null).text(project.timePeriod);
		dialogRepoLink.toggle(project.repoUrl !== null).attr('href', project.repoUrl);
	}

	//when the page loads we reposition shapes into a grid immediately
	repositionShapes();
});