# xlsx-parse-json #

### Description ###
Parse csv, xls, xlsx into json. Having multiple sheets is not an issue we return and object for each sheet found. See example below for more info. Visit https://abelalvarez.info/xlsx-parse-json/ to test it online.

### Install ###
````
npm install xlsx-parse-json
````

### Use node ###
To use this library you need to have already the file uploaded, there are many libraries out there to select a file from your system. In the example below I provided an HTML(bootstrap) snippet and a JS snippet, of the components you need to have.
Example
````
import xlsxParser from 'xlsx-parse-json';

xlsxParser
  .onFileSelection(file)
  .then(data => {
    var parsedData = data;
  });

````

````
<html>
...
<form>
  <div class="form-group">
    <label for="exampleFormControlFile1">Example file input</label>
    <input type="file" class="form-control-file" id="exampleFormControlFile1">
  </div>
</form>
...
</html>

````

Example using AngularJS
Install
````
npm install ng-file-upload
npm install xlsx-parse-json
````
index.js 
````
'use strict';

var angular = require('angular');

require('ng-file-upload');

angular.module('test-xls-parser', ['ngFileUpload'])
.component('testXlsParserUpload', {
    template: '<input type="file" ngf-select="vm.uploadFile($file)" ng-disabled="vm.disableUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/><pre>{{vm.data | json}}</pre>',
    controller: function() {
        var vm = this;
        var xlsxParser = require('xlsx-parse-json');

        vm.uploadFile = function(file){
            xlsxParser.onFileSelection(file)
			.then((data) => {
				vm.data = data;
			});
        }
    },
    controllerAs: 'vm'
});

````
index.html
````
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>XLS-Parser</title>
</head>
<body ng-app="test-xls-parser">
    <test-xls-parser-upload>loading</test-xls-parser-upload>
    
    <script src="bundle.min.js"></script>
</body>
</html>
````

# input file #
### Test (sheet name)
````
Price |  Name
-----------------
4     |   a
8     |   b
9     |   c
4     |
````

### Sheet1 (sheet name)
````
Name	| Lastname	| Age
-------------------------
Nico	| Jhones		| 69
Carl	|       		| 4
Abel	|       		| 30
Gabe	|       		|

````

# output sample #
````
{
  "Test": [
    {
      "Price": 4,
      "Name": "a"
    },
    {
      "Price": 8,
      "Name": "b"
    },
    {
      "Price": 9,
      "Name": "c"
    },
    {
      "Price": 4
    }
  ],
  "Sheet1": [
    {
      "Name": "Nico",
      "Lastname": "Jhones",
      "Age": 69
    },
    {
      "Name": "Carl",
      "Age": 4
    },
    {
      "Name": "Abel",
      "Age": 55
    },
    {
      "Name": "Gabe"
    }
  ]
}
````


### Optional Parameters
There are optional parameters to show. They should be provided in the second argument
````
The default values are { showNullProperties = false, hideEmptyRows = true }
onFileSelection = (file, { showNullProperties = false, hideEmptyRows = true })
````

Setting showNullProperties = true; will show all properties on every object example
# input file #
### Test (sheet name)
````
Price |  Name
-----------------
4     |   a
8     |   b
      |   c
4     |

````

# output sample #
````
{
  "Test": [
    {
      "Price": 4,
      "Name": "a"
    },
    {
      "Price": 8,
      "Name": "b"
    },
    {
      "Price": null,
      "Name": "c"
    },
    {
      "Price": 4
      "Name": null
    }
  ]
}
````

Setting { showNullProperties = true hideEmptyRows = false } will show all properties on every object example including empty rows with null values
# input file #
### Test (sheet name)
````
Price |  Name
-----------------
4     |   a
8     |   b
      |
      |   c
4     |

````

# output sample #
````
{
  "Test": [
    {
      "Price": 4,
      "Name": "a"
    },
    {
      "Price": 8,
      "Name": "b"
    },
    {
      "Price": null,
      "Name": null
    },
    {
      "Price": null,
      "Name": "c"
    },
    {
      "Price": 4
      "Name": null
    }
  ]
}
````