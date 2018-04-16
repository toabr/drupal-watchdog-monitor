<html>
<head>
  <meta charset="UTF-8">
  <title>Drupal Monitor</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <h1>Drupal Monitor</h1>
  <form id="filter" method="get">
    <h2>Filter</h2>
    <label for="log-files">File:</label>
    <select name="file" id="log-files">
      <option value="none">none</option>
    </select>
    <label for="type">Type:</label>
    <input type="text" name="type" id="type" placeholder="content for example" />
    <input type="submit" value="Submit">
  </form>
  <div id="monitor"></div>

  <script type="text/javascript" src="script.js"></script>
</body>
</html>
