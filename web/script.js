$(document).ready(function() {
	//data
	var projectData = <%= projectData %>; //jshint ignore:line
	var tileSize = <%= tileSize %>; //jshint ignore:line

	//elements
	var elements = projectData.map(function(project) {
		return $('#project-' + project.id);
	});

	//whenever we change the width of the screen, we may need to re-squish everything together
	function repositionShapes() {
		var numColumns = 5; //TODO determine based on screen width, etc

		//let's create a grid of what space has been filled so far
		var grid = {};
		for(var c = 0; c < numColumns; c++) {
			grid[c] = {};
		}

		//for each project/shape, find the earliest place where it fits
		var numRows = 1;
		for(i = 0; i < projectData.length; i++) {
			var shape = projectData[i].shape;
			var position = repositionShape(grid, numRows, numColumns, shape);
			var shapeHeight = shape.length;
			numRows = Math.max(numRows, position.row + shapeHeight + 1);

			//move the actual element
			elements[projectData[i].id].css({
				position: 'absolute',
				top: position.row * tileSize.height + (position.row - 1) * tileSize.margin,
				left: position.col * tileSize.width + (position.col - 1) * tileSize.margin
			});
		}
	}
	function repositionShape(grid, numRows, numColumns, shape) {
		var r, c, r2, c2;
		var shapeWidth = Math.max.apply(Math, shape.map(function(row) { return row.length; }));
		for(r = 0; r <= numRows; r++) {
			for(c = 0; c <= numColumns - shapeWidth; c++) {
				if(tryToFitShapeInPosition(grid, shape, r, c)) {
					return { row: r, col: c };
				}
			}
		}
		//we shouldn't be able to get here without returning
	}
	function tryToFitShapeInPosition(grid, shape, r, c) {
		var r2, c2;
		for(r2 = 0; r2 < shape.length; r2++) {
			for(c2 = 0; c2 < shape[r2].length; c2++) {
				//make sure the shape can fit
				if(shape[r2][c2] !== ' ' && grid[c + c2][r + r2]) {
					return false;
				}
			}
		}
		//if we've gotten here then [r,c] is a valid position!
		//mark it as such in the grid
		for(r2 = 0; r2 < shape.length; r2++) {
			for(c2 = 0; c2 < shape[r2].length; c2++) {
				//make sure the shape can fit
				if(shape[r2][c2] !== ' ') {
					grid[c + c2][r + r2] = true;
				}
			}
		}
		return true;
	}

	repositionShapes();
});