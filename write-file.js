var fs = require('fs');

fs.writeFile("test", "Hey there!", function(err) {
      if(err) {
      } else {
        console.log("The file was saved!");
      }
}); 
