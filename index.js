'use strict';
var sheetJs = require('xlsx');
var parsedXls = [];

exports.onFileSelection = function (file) {
	parsedXls = [];

	return new Promise(function(resolve, reject) {
		var reader = new FileReader();

		reader.addEventListener('loadend', function () {
			var binary = '';
			var bytes = new Uint8Array(reader.result);

			for (var i = 0; i < bytes.byteLength; i++) {
				binary += String.fromCharCode(bytes[i]);
			}

			resolve(onLoadEvent(binary, reader));
		});
		reader.readAsArrayBuffer(file);
	});
};

function onLoadEvent(binary, reader) {
	var workbook = sheetJs.read(binary, {
		type: 'binary'
	});

	var first_sheet_name = workbook.SheetNames[0];
	var worksheet = workbook.Sheets[first_sheet_name];

	var desired_cells = worksheet['!ref'];
	var lastColRow = getLastRowCol(desired_cells);
	var headers = getHeaders(worksheet, desired_cells);

	for (var R = 2; R <= lastColRow; R++) {
		var charCode = 65;
		var element = {};
		headers.forEach(function (header) {
			var cellValue = worksheet[String.fromCharCode(charCode++) + R];
			if (cellValue) {
				element[header] = cellValue.v
			}
		});
		parsedXls.push(element);
	}

	return parsedXls;
}

function getLastRowCol(cells) {
	var rows = cells.split(':');
	var lastColLetter = extractLetter(rows[1]);
	var array = rows[1].split(lastColLetter);

	return Number(array[1]);
}

function getHeaders(worksheet, desired_cells) {
	var cells = desired_cells.split(':');
	var cellHeader = cells[cells.length - 1];
	var lastColLetter = extractLetter(cells[1]);
	var charCode = 65;
	var headers = [];

	while (true) {
		var currentCell = String.fromCharCode(charCode++);
		var cellHeader = worksheet[currentCell + 1];
		if (cellHeader) {
			headers.push(cellHeader.v)
		}
		if (lastColLetter == currentCell) {
			return headers;
		}
	}
}

function extractLetter(str) {
	var array = str.split(/[0-9]+/);
	return array[0];
}
