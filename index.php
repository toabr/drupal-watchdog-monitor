<?php
  $files = glob('logs/*.json', GLOB_BRACE);
  $aliases = fopen("aliases.txt", "r");
?>

<html>
<head>
  <meta charset="UTF-8">
  <title>Drupal Monitor</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <h1>Drupal Monitor</h1>
  <div id="monitor">

  </div>

  <script>
    var sites = <?php echo json_encode($files); ?>;
  </script>
  <script type="text/javascript" src="script.js"></script>

</body>
</html>
