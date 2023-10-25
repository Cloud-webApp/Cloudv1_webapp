#!/bin/bash
# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

sudo apt install unzip
# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm
# Check Node.js version
nodejs -v


# sudo useradd -m webappuser
# sudo groupadd webappgroup
 
# # Add webappuser and admin to the webappgroup
# sudo usermod -aG webappgroup webappuser
# sudo usermod -aG webappgroup admin
 
# # Set ownership and permissions for webappuser's home directory
# sudo chown -R webappuser:webappgroup /home/webappuser
# sudo chmod -R 750 /home/webappuser
 
# # Set ownership and permissions for the app.js file in admin's directory
# sudo chown webappuser:webappgroup /home/admin/web-app/app.js
# sudo chmod 750 /home/admin/web-app/app.js
 
 
# # Add webappuser to the systemd-journal group
# sudo usermod -aG systemd-journal webappuser
 
# # Set the .env file in admin's directory
# sudo chmod 644 /home/admin/web-app/.env
 
# # Create the log file and set ownership and permissions
# sudo touch /var/log/webapp.log
# sudo chown webappuser:webappgroup /var/log/webapp.log
# sudo chmod 644 /var/log/webapp.log