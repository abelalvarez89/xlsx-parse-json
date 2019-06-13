'use strict';
const sheetJs = require('xlsx');

exports.onFileSelection = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.addEventListener('loadend', () => {
			let binary = '';
			const bytes = new Uint8Array(reader.result);

			for (let i = 0; i < bytes.byteLength; i++) {
				binary += String.fromCharCode(bytes[i]);
			}

			resolve(onLoadEvent(binary, reader));
		});
		reader.readAsArrayBuffer(file);
	});
};

const onLoadEvent = (binary, reader) => {
	const parsedXls = {};
	var workbook = sheetJs.read(binary, {
		type: 'binary'
	});
	const sheetNames = getSheetNames(workbook);

	sheetNames.forEach(name => {
		const sheet = workbook.Sheets[name];
		const desiredCells = getDesiredCells(sheet);
		const lastColRow = getLastRowCol(desiredCells);
		const headers = getHeaders(sheet, desiredCells);

		parsedXls[name] = getDate(lastColRow, headers, sheet);
	});

	return parsedXls;
}

const getDate = (lastColRow, headers, sheet) => {
	const data = [];

	for (let R = 2; R <= lastColRow; R++) {
		let charCode = 65;
		const element = {};

		headers.forEach((header) => {
			const cellValue = getValue(sheet, charCode++, R);

			if (cellValue) {
				element[header] = cellValue.w
			}
		});
		if (Object.keys(element).length > 0) {
			data.push(element);
		}
	}

	return data;
}

const getValue = (sheet, charCode, R) => sheet[String.fromCharCode(charCode) + R];

const getSheetNames = (workbook) => workbook.SheetNames;

const getDesiredCells = (worksheet) => worksheet['!ref'];

const getLastRowCol = (cells) => {
	const rows = cells.split(':');
	const lastColRow = rows.length > 1 ? rows[1] : rows[0];

	const lastColLetter = extractLetter(lastColRow);
	const array = lastColRow.split(lastColLetter);

	return Number(array[1]);
}

const getHeaders = (worksheet, desired_cells) => {
	const cells = desired_cells.split(':');
	const lastCell = cells.length > 1 ? cells[1] : cells[0];
	const lastColLetter = extractLetter(lastCell);
	let charCode = 65;
	const headers = [];

	while (true) {
		const currentCell = String.fromCharCode(charCode++);
		const cellHeader = worksheet[currentCell + 1];

		if (cellHeader) {
			headers.push(cellHeader.v)
		}
		if (lastColLetter == currentCell) {
			return headers;
		}
	}
}

const extractLetter = (str) => {
	const array = str.split(/[0-9]+/);
	return array[0];
}
