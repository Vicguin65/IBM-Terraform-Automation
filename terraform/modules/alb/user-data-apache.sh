#!/bin/bash
sudo apt-get update
sudo apt-get install -y apache2
sudo git clone https://github.com/Vicguin65/IBM-Identity-Center-API.git
cd IBM-Identity-Center-API
sudo git checkout crime-data-analysis
sudo systemctl start apache2
sudo systemctl enable apache2
sudo cp -a ./liedetector/. /var/www/html/
sudo echo "<h1> Accessed from $(hostname -f)</h1>" >> /var/www/html/index.html