( () => {

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

  function printLog(file, filter) {
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

        // filter if there is one
        if( filter.type && !(filter.type === logObj[serial].type) ) {
          console.log('skip: ' + logObj[serial].type);
          continue;
        }

        let row = document.createElement("TR");
        row.classList.add(logObj[serial].severity);
        row.addEventListener('click', showDetails);
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
    headline.classList.add('title');
    let title = file.split('/');
    headline.innerHTML = title[title.length - 1].split('.json')[0];
    document.body.appendChild(headline);

    document.body.appendChild(tableWrapper);
  }

  function writeOptions(logDir) {
    scanFolder(logDir, function(response) {
      let index = document.createElement('DIV');
      index.innerHTML = response;
      let links = index.querySelectorAll('a');

      // clean file names
      let logFiles = [];
      links.forEach( link => {
        let filePath = link.href;
        let double = false;
        if(filePath.includes('.json')) {
          // get log name from path
          filePath = filePath.split('/');
          filePath = filePath[filePath.length - 1];
          // check for doubles
          logFiles.forEach( name => {
            if(filePath === name) {
              double = true;
            }
          });
          // add path if new
          if(!double) {
            logFiles.push(filePath);
          }
        }
      });
      let selectBox = document.getElementById('log-files');
      // build menu links
      logFiles.forEach( (file, index) => {
        let option = document.createElement('OPTION');
        option.innerText = file;
        option.value = file;
        selectBox.appendChild(option);
      });
    });
  }

  function showDetails() {
    let detailsWrapper = document.createElement("DIV");
    detailsWrapper.classList.add('details-wrapper');
    let details = document.createElement("DIV");
    detailsWrapper.addEventListener('click', function(e) {
      // console.log(e.target);
      if(e.target === this) {
        document.body.removeChild(this);
        document.body.classList.remove('details-view');
      }
    });
    detailsWrapper.appendChild(details);

    let labels = document.getElementsByTagName('TH');

    data = this.getElementsByTagName('TD');
    for(let i = 0; i < data.length; i++) {
      let detail = document.createElement("DIV");
      detail.classList.add('detail');
      detail.innerHTML += '<span class="label">' + labels[i].innerText + ': </span>';
      detail.innerHTML += '<span>' + data[i].innerText + '</span>';
      details.appendChild(detail);
    }
    document.body.appendChild(detailsWrapper);
    document.body.classList.add('details-view');
  }

  ( function init() {

    // specify folder
    const logDir = 'logs';

    // get search terms
    const params = new URL(location.href).searchParams;
    const logFile = logDir + '/' + params.get('file');
    const filter = { 'type':params.get('type'), 'id':888 };

    writeOptions(logDir);
    printLog(logFile,filter);

  })();



})();
