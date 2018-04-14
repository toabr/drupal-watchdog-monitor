
var monitor = document.querySelector('#monitor');

function loadJSON(file, callback) {
  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function printLog() {
  for (let i = 0; i < sites.length; i++) {
    let table = document.createElement("TABLE");
    let headline = document.createElement('H2');
    headline.innerHTML = sites[i];
    monitor.appendChild(headline);

    loadJSON(sites[i], function(response) {
      // Parse JSON string into object
      var toabr = JSON.parse(response);

      let thead = document.createElement("THEAD");
      thead.innerHTML = '<tr>' +
                        '<td>wid</td>' +
                        '<td>date</td>' +
                        '<td>severity</td>' +
                        '<td>type</td>' +
                        '<td>message</td>' +
                        '</tr>';
      table.appendChild(thead);
      let tbody = document.createElement("TBODY");

      for (let key in toabr) {
        // console.log(key, toabr[key]);
        let row = document.createElement("TR");
        row.classList.add(toabr[key].severity);

        row.innerHTML = '<td>' + toabr[key].wid + '</td>' +
                        '<td>' + toabr[key].date + '</td>' +
                        '<td>' + toabr[key].severity + '</td>' +
                        '<td>' + toabr[key].type + '</td>' +
                        '<td>' + toabr[key].message + '</td>';
        tbody.insertBefore(row, tbody.childNodes[0]);
      }
      table.appendChild(tbody);
    });
    let tableWrapper = document.createElement("DIV");
    tableWrapper.classList.add('table-wrapper');
    tableWrapper.appendChild(table);
    monitor.appendChild(tableWrapper);
  }
}

printLog();
