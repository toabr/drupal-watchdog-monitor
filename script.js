( () => {

  function scanFolder(logDir, callback) {
    let fileextension = ".json";

    let xobj = new XMLHttpRequest();
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

  function printLog(filePath, filter) {
    let log = document.getElementById('log')
    log.innerHTML = '';
    let table = document.createElement("table");

    loadJSON(filePath, function(response) {
      // Parse JSON string into object
      let logObj = JSON.parse(response);

      // bild table header from the first object set
      let thead = document.createElement("thead");
      let theadRow = document.createElement("tr");
      let firstKey = Object.keys(logObj)[0];
      for (let key in logObj[firstKey]) {
        theadRow.innerHTML += `<th>${key}</th>`;
      }
      thead.appendChild(theadRow);
      table.appendChild(thead);

      // build table body
      let tbody = document.createElement("tbody");
      for (let serial in logObj) {

        // filter
        let passedFilter = true;
        filter.forEach( (value, key) => {
          if(logObj[serial][key] && value != logObj[serial][key]) {
            passedFilter = false;
          }
        });
        if(!passedFilter) { continue }

        let row = document.createElement("tr");
        row.classList.add(logObj[serial].severity);
        row.addEventListener('click', showDetails);
        for (let field in logObj[serial]) {
          row.innerHTML += `<td>${logObj[serial][field]}</td>`;
        }
        tbody.insertBefore(row, tbody.childNodes[0]);
      }
      table.appendChild(tbody);
    });

    let tableWrapper = document.createElement("div");
    tableWrapper.setAttribute('id', 'table-wrapper');
    tableWrapper.appendChild(table);

    // create hedline
    let headline = document.createElement('h2');
    headline.classList.add('title');
    let title = filePath.split('/');
    headline.innerHTML = title[title.length - 1].split('.json')[0];
    log.appendChild(headline);

    log.appendChild(tableWrapper);
    setTimeout( () => styleThead(), 100 );
  }

  function writeOptions(logDir) {
    scanFolder(logDir, function(response) {
      let index = document.createElement('div');
      index.innerHTML = response;
      let links = index.querySelectorAll('a');

      let logFiles = new Set();
      // fill logFiles
      links.forEach( link => {
        let filePath = link.href;
        if(filePath.includes('.json')) {

          // get file name from path
          filePath = filePath.split('/');
          filePath = filePath[filePath.length - 1];

          // check for doubles
          if(!logFiles.has(filePath)) {
            logFiles.add(filePath);
          }
        }
      });

      let selectBox = document.getElementById('filter-file');
      // build selectbox options
      logFiles.forEach( (file, index) => {
        let option = document.createElement('option');
        option.innerText = file;
        option.value = file;
        selectBox.appendChild(option);
      });
    });
  }

  function showDetails() {
    let detailsWrapper = document.createElement("div");
    detailsWrapper.classList.add('details-wrapper');
    let details = document.createElement("div");
    detailsWrapper.addEventListener('click', function(e) {
      if(e.target === this) {
        document.body.removeChild(this);
        document.body.classList.remove('details-view');
      }
    });
    detailsWrapper.appendChild(details);

    let labels = document.getElementsByTagName('th');

    data = this.getElementsByTagName('td');
    for(let i = 0; i < data.length; i++) {
      let detail = document.createElement("div");
      detail.classList.add('detail');
      detail.innerHTML += `<span class="label"> ${labels[i].innerText}: </span>`;
      detail.innerHTML += `<span class="data"> ${data[i].innerText} </span>`;
      details.appendChild(detail);
    }
    document.body.appendChild(detailsWrapper);
    document.body.classList.add('details-view');
  }

  // style fixed header
  function styleThead() {
    let tableWrapper = document.getElementById('table-wrapper');
    let thead = document.getElementsByTagName('thead');

    let fakeHead = document.createElement('div');
    fakeHead.style.width = thead[0].offsetWidth;

    tableWrapper.style['max-height'] = (window.innerHeight - tableWrapper.offsetTop - 35);
    console.dir(tableWrapper);

    let cells = [...thead[0].getElementsByTagName('th')];
    cells.forEach( (cell) => {
      fakeHead.innerHTML += `<div style="width:${cell.offsetWidth}px;">${cell.innerText}</div>`;
    });
    fakeHead.classList.add('fake-head');

    // make fakeHead sticky
    tableWrapper.addEventListener('scroll', () => {
      fakeHead.style.top = tableWrapper.scrollTop;
    });
    tableWrapper.insertBefore(fakeHead, tableWrapper.childNodes[0])
  }

  // initialize
  ( function init() {
    // specify folder
    const logDir = 'logs';
    writeOptions(logDir);
    // form filter
    document.getElementsByTagName('form')[0].addEventListener('submit', function(e) {
      e.preventDefault();
      let filePath = `${logDir}/${document.getElementById('filter-file').value}`;
      let filter = new Map();
      filter.set('type', document.getElementById('filter-type').value);
      filter.set('severity', document.getElementById('filter-severity').value);

      // delete empty form fields from the array
      filter.forEach( (value, key) => {
        if(value === '') { filter.delete(key); }
      });

      // print filtered log
      printLog(filePath, filter);
    });

  })();



})();
