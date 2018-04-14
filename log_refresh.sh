#!/bin/bash
# @file
# drupal-monitor - watchdog log via drush

while read line; do
  sa=$(echo $line | cut -d' ' -f1)
  filename=$(echo $line | cut -d' ' -f 2)
  drush $sa ws --count=100 --format=json > logs/${filename}.json &
  echo $filename.json created &
done <aliases.txt
