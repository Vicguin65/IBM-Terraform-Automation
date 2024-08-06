#!/bin/bash
sudo apt-get update
sudo apt-get install -y apache2
sudo apt-get install -y nodejs
sudo apt-get install -y npm

# Clone the repository
cd /home/ubuntu
sudo git clone https://github.com/Vicguin65/IBM-Terraform-Automation.git
cd IBM-Terraform-Automation/lie_detect

# Install dependencies and build the React app
sudo npm install
sudo npm run build

# Copy the build files to the Apache root directory
sudo cp -a build/. /var/www/html/


# Start and enable Apache
sudo systemctl start apache2
sudo systemctl enable apache2