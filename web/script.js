$(document).ready(function() {
	//data
	var projects = <%= projects %>; //jshint ignore:line
	var tileSize = <%= tileSize %>; //jshint ignore:line

	//sort projects by size of the shape
	var projectsByShapeSize = projects.slice(0).sort(function(a, b) {
		return b.grid.area - a.grid.area;
	});
	var MAX_SHAPE_COLS = Math.max.apply(Math, projects.map(function(project) {
		return project.grid.cols;
	}));

	//cache performance object
	var perf = performance;

	//constants
	var TILE_STILL_IMAGE_SEQUENTIAL_LOAD_TIME = 4;
	var TILE_IMAGE_FADE_IN_TIME = 400;
	var TILE_IMAGE_FADE_OUT_TIME = 400;
	var TILE_REPOSITION_DELAY = 250;
	var TILE_REPOSITION_TIME = 0;
	var DIALOG_FADE_IN_TIME = 350;
	var DIALOG_FADE_OUT_TIME = 300;
	var DIALOG_SLIDE_TIME = 600;
	var DIALOG_EXTRA_SLIDE_DIST = 600;
	var DIALOG_DETAILS_HIDE_TIME = 500;
	var DIALOG_DETAILS_SHOW_TIME = 500;
	var DIALOG_EXTRA_CONTENT_LOAD_TIME = 300;
	var DIALOG_EXPANSION_TIME = 800;
	var DIALOG_SHRINK_TIME = 800;

	//gather jQuery references to elements
	var $body = $(document.body);
	var $shapeContainer = $('#shapes');
	var $dialogStuff = $('#dialog-stuff').hide();
	var $leftArrow = $dialogStuff.find('.left-arrow');
	var $rightArrow = $dialogStuff.find('.right-arrow');
	var dialogs = [ new Dialog($('#dialog-0')), new Dialog($('#dialog-1')) ];

	//body cannot be smaller than width of content
	$body.css('min-width', MAX_SHAPE_COLS * (tileSize.height + tileSize.margin));

	//bind events when a shape is moused over or clicked
	projects.forEach(function(project) {
		project.$shape = $('#shape-' + project.id);
		//the animated/fully color image is lazy-loaded when you hover over it
		var $img = null;
		function lazyLoad$Img() {
			if(!$img) {
				$img = $('<img ' +
					'src="' + project.grid.imageUrl +'" ' +
					'width="' + (project.grid.width - tileSize.margin) + 'px" ' +
					'height="' + (project.grid.height - tileSize.margin) + 'px"></img>')
					.prependTo(project.$shape);
			}
		}
		project.$shape
			//on hover, fade in the saturated/animated image
			.on('mouseenter', function() {
				lazyLoad$Img();
				$img.stop().fadeTo(Math.floor(TILE_IMAGE_FADE_IN_TIME * (1.0 - +$img.css('opacity'))), 1.0);
			})
			//when the mouse leaves the shape, fade out the saturated/animated image
			.on('mouseleave', function() {
				lazyLoad$Img();
				$img.stop().fadeTo(Math.floor(TILE_IMAGE_FADE_OUT_TIME * (+$img.css('opacity'))), 0.0);
			})
			//when a shape is clicked, open the project dialog
			.on('click', function() {
				lazyLoad$Img();
				openDialog(project);
				$img.stop().fadeTo(Math.floor(TILE_IMAGE_FADE_OUT_TIME * (+$img.css('opacity'))), 0.0);
			});
	});

	//reposition shapes such that they all fit together nice and pretty without any gaps
	var numColumnsCurrentlyRendered = null;
	function repositionShapes(immediately) {
		//figure out width of content area based on width of body
		var contentWidth = $body.width();
		//we only need to reposition the shapes if we change the number of columns displayed
		var numColumns = Math.max(MAX_SHAPE_COLS, Math.floor((contentWidth - tileSize.margin) /
			(tileSize.width + tileSize.margin)));
		if(numColumnsCurrentlyRendered === numColumns) {
			return;
		}
		numColumnsCurrentlyRendered = numColumns;

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
			if(immediately) {
				project.$shape.css({
					position: 'absolute',
					top: position.row * (tileSize.height + tileSize.margin),
					left: position.col * (tileSize.width + tileSize.margin)
				});
			}
			else {
				project.$shape.css('position', 'absolute').animate({
					top: position.row * (tileSize.height + tileSize.margin),
					left: position.col * (tileSize.width + tileSize.margin)
				}, TILE_REPOSITION_TIME);
			}
		});

		//resize body to make space for repositioned shapes
		var height = (numRows - 1) * (tileSize.height + tileSize.margin);
		$shapeContainer.width(numColumns * (tileSize.width + tileSize.margin));
		if(immediately) {
			$shapeContainer.height(height);
		}
		else {
			$shapeContainer.animate({ height: height }, TILE_REPOSITION_TIME);
		}
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
					amountOfMess += (hasEncounteredFilledTile ? 1.2 : 1) * (numRows - r);
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

	//when you click a shape it opens a dialog with the project details
	var activeDialogIndex = null;
	function openDialog(project) {
		if(activeDialogIndex === null) {
			//open a dialog
			activeDialogIndex = 0;
			var activeDialog = dialogs[activeDialogIndex];

			//lock scrolling
			$body.addClass('no-scroll');

			//fade all of the dialog... stuff into view
			activeDialog.startOpening(project, true, 'center', 'center');
			$dialogStuff.show().fadeTo(DIALOG_FADE_IN_TIME, 1.0, function() {
				//fill in the content area only after the dialog is fully visible
				setTimeout(function() {
					activeDialog.open();
				}, DIALOG_EXTRA_CONTENT_LOAD_TIME);
			});
		}
	}

	//when you click in the dark area around the dialog, close the dialog
	$('.dialog, .dialog .body').on('click', function(evt) {
		if(evt.target === this && activeDialogIndex !== null) {
			var activeDialog = dialogs[activeDialogIndex];
			if(activeDialog.state === 'open' || activeDialog.state === 'expanded') {
				//now fade all of the dialog... stuff OUT of view
				activeDialog.startClosing('center', 'center');
				$dialogStuff.fadeTo(DIALOG_FADE_OUT_TIME, 0.0, function() {
					$dialogStuff.hide();

					//unlock scrolling
					$body.removeClass('no-scroll');

					//we are now fully closed
					activeDialog.close();
					activeDialogIndex = null;
				});
			}
		}
	});

	//when the left/right buttons are clicked, we move to the previous/next project
	$leftArrow.on('click', function() {
		if(activeDialogIndex !== null) {
			var activeDialog = dialogs[activeDialogIndex];
			if(activeDialog.state === 'open' || activeDialog.state === 'expanded') {
				//switch to previous project
				var len = projects.length;
				switchDialog(projects[(dialogs[activeDialogIndex].project.index + len - 1) % len], 'left');
			}
		}
	});
	$rightArrow.on('click', function() {
		if(activeDialogIndex !== null) {
			var activeDialog = dialogs[activeDialogIndex];
			if(activeDialog.state === 'open' || activeDialog.state === 'expanded') {
				//switch to next project
				var len = projects.length;
				switchDialog(projects[(dialogs[activeDialogIndex].project.index + 1) % len], 'right');
			}
		}
	});

	function switchDialog(project, dir) {
		//slide the active dialog off to the side
		var oldActiveDialog = dialogs[activeDialogIndex];
		oldActiveDialog.startClosing('center', (dir === 'left' ? 'right' : 'left'));

		//find the next active dialog and aslide it onscreen
		activeDialogIndex = 1 - activeDialogIndex;
		var activeDialog = dialogs[activeDialogIndex];
		activeDialog.startOpening(project, oldActiveDialog.detailsPaneShown, dir, 'center');

		//finish when they're done sliding
		setTimeout(function() {
			oldActiveDialog.close();
			setTimeout(function() {
				activeDialog.open();
			}, DIALOG_EXTRA_CONTENT_LOAD_TIME);
		}, DIALOG_SLIDE_TIME);
	}

	function Dialog($root) {
		var self = this;
		this.state = 'closed';
		this.project = null;
		this.detailsPaneShown = true;
		this._loadedFullVersion = false;
		this._timeStartedExpanding = null;

		//find HTML elements
		this._$root = $root.hide();
		this._$body = $root.find('.body');
		this._$details = $root.find('.details');
		this._$h2 = $root.find('h2');
		this._$title = $root.find('.title');
		this._$timePeriod = $root.find('.time-period');
		this._$h3 = $root.find('h3');
		this._$medium = $root.find('.medium');
		this._$repoLink = $root.find('.repo-link');
		this._$description = $root.find('.description');
		this._$instructions = $root.find('.instructions');
		this._$content = $root.find('.content');
		this._$actualContent = $root.find('.actual-content');
		this._$hideDetailsLink = $root.find('.hide-details a');
		this._$showDetailsArea = $root.find('.show-details');
		this._$showDetailsLink = $root.find('.show-details a');
		this._$fullScreenIcon = $root.find('.full-screen-icon');

		//bind events
		//when you click the hide link, hide the details pane
		this._$hideDetailsLink.on('click', function() {
			if(self.detailsPaneShown) {
				self.detailsPaneShown = false;
				self._hideDetails(false);
				self._showDetailsLink(false);
			}
		});
		//when you click the Show Details link, show the details pane
		this._$showDetailsLink.on('click', function() {
			if(!self.detailsPaneShown) {
				self.detailsPaneShown = true;
				self._showDetails(false);
				self._hideDetailsLink(false);
			}
		});
		//when you hover over the dialog's content, display a full screen icon for images
		this._$content.on('mouseenter', function() {
			if(self.project.content.type === 'image') {
				self._$fullScreenIcon.show();
			}
		});
		this._$content.on('mouseleave', function() {
			self._$fullScreenIcon.hide();
		});
		this._$fullScreenIcon.on('click', function() {
			if(self.state === 'open') {
				self.state = 'expanding';
				self._$fullScreenIcon.addClass('enlarged');
				if(!self._loadedFullVersion) {
					self._emptyContent();
				}
				self._hideDetails(true);
				self._hideDetailsLink(true);
				self._timeStartedExpanding = perf.now();
				self._updateExpandingAnimation();
			}
			else if(self.state === 'expanded') {
				self.state = 'shrinking';
				self._$fullScreenIcon.removeClass('enlarged');
				self._$actualContent.stop().animate({
					width: self.project.content.width,
					height: self.project.content.height
				}, DIALOG_SHRINK_TIME, function() {
					self.state = 'open';
					if(self.detailsPaneShown) {
						self._showDetails(false);
						self._hideDetailsLink(false);
					}
					else {
						self._hideDetails(false);
						self._showDetailsLink(false);
					}
				});
			}
		});
	}
	Dialog.prototype.startOpening = function(project, showDetails, startPosition, endPosition) {
		this.state = 'opening';
		this.project = project;
		this._loadedFullVersion = false;

		//show the dialog
		this._$root.show();

		//position and slide dialog
		this._slide(startPosition, endPosition);

		//load the initial data
		this._renderData();
		this._prerenderContent();

		this._$fullScreenIcon.removeClass('enlarged');

		//show/hide details
		this.detailsPaneShown = showDetails;
		if(showDetails) {
			this._showDetails(true);
			this._hideDetailsLink(true);
		}
		else {
			this._hideDetails(true);
			this._showDetailsLink(true);
		}
	};
	Dialog.prototype.open = function() {
		this.state = 'open';
		this._renderContent();
	};
	Dialog.prototype.startClosing = function(startPosition, endPosition) {
		this.state = 'closing';
		this._slide(startPosition, endPosition);
	};
	Dialog.prototype.close = function() {
		this.state = 'closed';
		this.project = null;
		this._emptyContent();
		this._$root.hide();
	};
	Dialog.prototype.resize = function() {
		if(this.state === 'expanding') {
			this._updateExpandingAnimation();
		}
		else if(this.state === 'expanded') {
			this._resizeExpandedContent();
		}
	};
	Dialog.prototype._calculateExpandedContentSize = function() {
		var widthPercent = this._$body.width() / this.project.content.full.width;
		var heightPercent = this._$body.height() / this.project.content.full.height;
		var percent = Math.min(1.0, widthPercent, heightPercent);
		return {
			width: Math.max(this.project.content.width, this.project.content.full.width * percent),
			height: Math.max(this.project.content.height, this.project.content.full.height * percent)
		};
	};
	Dialog.prototype._updateExpandingAnimation = function() {
		var self = this;
		var timeLeft = Math.max(0, DIALOG_EXPANSION_TIME + this._timeStartedExpanding - perf.now());
		var size = this._calculateExpandedContentSize();
		this._$actualContent.stop().animate({
			width: size.width,
			height: size.height
		}, timeLeft, function() {
			self.state = 'expanded';
			if(!self._loadedFullVersion) {
				self._loadedFullVersion = true;
				self._renderImageContent(self.project.content.full.url);
			}
		});
	};
	Dialog.prototype._resizeExpandedContent = function() {
		var size = this._calculateExpandedContentSize();
		this._$actualContent.css({ width: size.width, height: size.height });
	};
	Dialog.prototype._renderData = function() {
		this._$title.toggle(!!this.project.title).html(this.project.title);
		this._$timePeriod.toggle(!!this.project.timePeriod).text("(" + this.project.timePeriod + ")");
		this._$h2.toggle(!!this.project.title || !!this.project.timePeriod);
		this._$medium.toggle(!!this.project.medium).text(this.project.medium);
		this._$repoLink.toggle(!!this.project.repoUrl).attr('href', this.project.repoUrl);
		this._$h2.toggle(!!this.project.medium || this.project.repoUrl);
		this._$description.toggle(!!this.project.description).html(this.project.description);
		this._$instructions.toggle(!!this.project.instructions).html(this.project.instructions);
	};
	Dialog.prototype._prerenderContent = function() {
		//resize the content area to fit the content that will be there
		this._$content.css('min-height', this.project.content.height);
		this._$actualContent.css({
			width: this.project.content.width,
			height: this.project.content.height
		});
	};
	Dialog.prototype._renderContent = function() {
		var c = this.project.content;
		if(c.type === 'iframe') {
			this._renderIframeContent(c.url, c.x, c.y, c.width, c.height);
		}
		else if(c.type === 'image') {
			this._renderImageContent(c.url, c.width, c.height);
		}
	};
	Dialog.prototype._renderIframeContent = function(url, x, y, width, height) {
		$('<div style="overflow: hidden;' +
			'width: ' + width + 'px; ' +
			'height: ' + height + 'px;">' +
				'<iframe ' +
					'src="' + url +'" ' +
					'width="' + (x + width) + 'px" ' +
					'height="' + (y + height) + 'px" ' +
					'frameborder="0" ' +
					'scrolling="no" ' +
					'style="margin-left:' + (-x) + 'px;margin-top:' + (-y) + 'px;"' +
					'></iframe>' +
			'</div>')
			.appendTo(this._$actualContent).find('iframe').focus();
	};
	Dialog.prototype._renderImageContent = function(url, width, height) {
		$('<img class="image-content" src="' + url + '" ' +
			'width="' + (width ? width + 'px' : '100%') + '" ' +
			'height="' + (height ? height + 'px' : '100%') + '" />')
			.appendTo(this._$actualContent);
	};
	Dialog.prototype._slide = function(startPosition, endPosition) {
		var dist = $body.width() / 2 + DIALOG_EXTRA_SLIDE_DIST;

		//position dialog initially
		if(startPosition === 'left') {
			this._$body.css('left', -dist);
		}
		else if(startPosition === 'right') {
			this._$body.css('left', dist);
		}
		else if(startPosition === 'center') {
			this._$body.css('left', 0);
		}

		//slide dialog into final position
		if(endPosition !== startPosition) {
			if(endPosition === 'left') {
				this._$body.animate({ left: -dist }, DIALOG_SLIDE_TIME);
			}
			else if(endPosition === 'right') {
				this._$body.animate({ left: dist }, DIALOG_SLIDE_TIME);
			}
			else if(endPosition === 'center') {
				this._$body.animate({ left: 0 }, DIALOG_SLIDE_TIME);
			}
		}
	};
	Dialog.prototype._emptyContent = function() {
		this._$actualContent.empty();
	};
	Dialog.prototype._showDetails = function(immediately) {
		this._$details.show();
	};
	Dialog.prototype._hideDetails = function(immediately) {
		this._$details.hide();
	};
	Dialog.prototype._showDetailsLink = function(immediately) {
		if(immediately) {
			this._$showDetailsArea.css('opacity', '1.0').show();
		}
		else {
			this._$showDetailsArea.css('opacity', '0.0').show().fadeTo(500, 1.0);
		}
	};
	Dialog.prototype._hideDetailsLink = function(immediately) {
		this._$showDetailsArea.css('opacity', '0.0').hide();
	};

	//when the page is resized, we may need to reposition all of the shapes
	var tileRepositionTimer = null;
	var timeOfLastResizeEvent = null;
	function resetTileRepositionTimer(delay) {
		timeOfLastResizeEvent = null;
		tileRepositionTimer = setTimeout(function() {
			if(timeOfLastResizeEvent === null) {
				tileRepositionTimer = null;
				//page resizing has settled down -- reposition the shapes!
				repositionShapes(activeDialogIndex !== null);
			}
			else {
				resetTileRepositionTimer(TILE_REPOSITION_DELAY +
					1000 * Math.floor(timeOfLastResizeEvent - perf.now()));
			}
		}, delay);
	}
	$(window).on('resize', function() {
		if(activeDialogIndex !== null) {
			dialogs[activeDialogIndex].resize();
		}
		if(!tileRepositionTimer) {
			resetTileRepositionTimer(TILE_REPOSITION_DELAY);
		}
		else {
			timeOfLastResizeEvent = perf.now();
		}
	});

	//when the page loads we reposition shapes into a grid immediately
	repositionShapes(true);

	//when you hover over the Contact me link, only then does it give my e-mail
	$('#main-footer .contact-link').on('mouseover', function() {
		$(this).attr('href', 'mai'+'lto'+':br'+'idg'+'s.d'+'ev@'+'gma'+'il.'+'com');
	});
});