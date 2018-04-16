
// build menu links and write to #menu div
function buildMenu(names) {
  // build menu links
  let menu = document.createElement('UL');
  menu.classList.add('main-menu');
  names.forEach( (item, index) => {
    let li = document.createElement('LI');
    let a = document.createElement('A');
    a.innerText = item;
    a.href = '?site=' + item;
    li.appendChild(a);
    menu.appendChild(li);
  });

  // write menu
  let container = document.getElementById('menu');
  container.appendChild(menu);
}

function getSearchTerm() {
  if(window.location.search.includes('?site=')) {
    return term = window.location.search.split('?site=')[1];
  }
}

function scanFolder(logDir, callback) {
  let fileextension = ".json";

  let xobj = new XMLHttpRequest();
      // xobj.overrideMimeType("html");
  xobj.open('GET', logDir, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function loadJSON(file, callback) {
  let xobj = new XMLHttpRequest();
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

function printLog(file) {
  let table = document.createElement("TABLE");

  loadJSON(file, function(response) {
    // Parse JSON string into object
    let logObj = JSON.parse(response);

    // bild table header from the first object set
    let thead = document.createElement("THEAD");
    let theadRow = document.createElement("TR");
    let firstKey = Object.keys(logObj)[0];
    for (let key in logObj[firstKey]) {
      let theadCell = document.createElement("TH");
      theadCell.innerText = key;
      theadRow.appendChild(theadCell);
    }
    thead.appendChild(theadRow);
    table.appendChild(thead);

    // build table body
    let tbody = document.createElement("TBODY");
    for (let serial in logObj) {
      let row = document.createElement("TR");
      row.classList.add(logObj[serial].severity);
      for (let field in logObj[serial]) {
        let cell = document.createElement("TD");
        cell.innerText = logObj[serial][field];
        row.appendChild(cell);
      }
      tbody.insertBefore(row, tbody.childNodes[0]);
    }
    table.appendChild(tbody);
  });

  let tableWrapper = document.createElement("DIV");
  tableWrapper.classList.add('table-wrapper');
  tableWrapper.appendChild(table);

  let headline = document.createElement('H2');
  headline.innerHTML = getSearchTerm();
  document.body.appendChild(headline);

  document.body.appendChild(tableWrapper);
}

function printMenu(logDir) {
  scanFolder(logDir, function(response) {
    let index = document.createElement('DIV');
    index.innerHTML = response;
    let links = index.querySelectorAll('a');

    // clean file names
    let logNames = [];
    links.forEach( link => {
      let filePath = link.href;
      let double = false;
      if(filePath.includes('.json')) {
        // get log name from path
        filePath = filePath.split('/');
        filePath = filePath[filePath.length - 1];
        filePath = filePath.split('.json');
        filePath = filePath[0];
        // check for doubles
        logNames.forEach( name => {
          if(filePath === name) {
            console.log('included !!!');
            double = true;
          }
        });
        // add path if new
        if(!double) {
          logNames.push(filePath);
        }
      }
    });
    buildMenu(logNames);
  });
}


( function init() {
  // specify folder
  let logDir = 'logs';
  // get url search term
  let logFile = logDir + '/' + getSearchTerm() + '.json';

  printMenu(logDir);
  printLog(logFile);

})();
