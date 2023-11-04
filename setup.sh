#!/bin/bash
# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm
# Check Node.js version

nodejs -v


echo 'Downloading the CloudWatch Agent package...'
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
 
echo 'Installing the CloudWatch Agent package...'
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
 
echo 'Enabling the CloudWatch Agent service...'
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent
 
rm ./amazon-cloudwatch-agent.deb



# touch /home/admin/web-app/.env
# echo 'DB_PORT=5432' >> /home/admin/web-app/.env
# echo 'DB_USER=csye6225' >> /home/admin/web-app/.env
# echo 'DB_PASSWORD=password' >> /home/admin/web-app/.env
# echo 'DB_DATABASE=csye6225' >> /home/admin/web-app/.env
# echo 'DB_HOST=localhost' >> /home/admin/web-app/.env
# echo 'CSVPATH=./users.csv' >> /home/admin/web-app/.env


# echo 'DB_PORT=${{ secrets.DB_PORT }}' >> /home/admin/web-app/.env
# echo 'DB_USER=${{ secrets.DB_USER }}' >> /home/admin/web-app/.env
# echo 'DB_PASSWORD=${{ secrets.DB_PASSWORD }}' >> /home/admin/web-app/.env
# echo 'DB_DATABASE=${{ secrets.DB_DATABASE }}' >> /home/admin/web-app/.env
# echo 'DB_HOST=${{ secrets.DB_HOST }}' >> /home/admin/web-app/.env
# echo 'CSVPATH=./users.csv' >> /home/admin/web-app/.env


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