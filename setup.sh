#!/bin/bash
sudo cp /tmp/webapp.zip /opt/webapp.zip
 
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
 
sudo apt update
sudo apt upgrade -y
sudo apt install -y nodejs
sudo apt install -y npm
sudo apt install -y unzip
sudo apt-get -y remove git
sudo apt-get update -y
sudo apt-get upgrade -y
echo 'Downloading the CloudWatch Agent package...'
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
 
echo 'Installing the CloudWatch Agent package...'
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
 
echo 'Enabling the CloudWatch Agent service...'
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent
 
rm ./amazon-cloudwatch-agent.deb
 
nodejs -v
 
cd /opt
sudo unzip webapp.zip -d csye6225
cd /opt/csye6225
sudo ls -la
sudo npm install



sudo chown -R csye6225:csye6225 /opt/csye6225
sudo chmod -R 750  /opt/csye6225
sudo -u csye6225 bash
 
sudo cp /tmp/my-app.service /etc/systemd/system/my-app.service
echo "Enabling the REST API Service"
sudo systemctl enable my-app
sudo systemctl start my-app
sudo systemctl restart my-app
sudo systemctl status my-app
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent























# sudo apt update
# sudo apt upgrade -y

# sudo cp /tmp/webapp.zip /opt/webapp.zip

# # Install Node.js and npm
# sudo apt install -y nodejs
# sudo apt install -y npm
# # Check Node.js version

# nodejs -v


# echo 'Downloading the CloudWatch Agent package...'
# sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
 
# echo 'Installing the CloudWatch Agent package...'
# sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
 
# echo 'Enabling the CloudWatch Agent service...'
# sudo systemctl enable amazon-cloudwatch-agent
# sudo systemctl start amazon-cloudwatch-agent
 
# rm ./amazon-cloudwatch-agent.deb



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


# sudo useradd -m csye6225
# sudo groupadd webappgroup
 
# # Add csye6225 and admin to the webappgroup
# sudo usermod -aG webappgroup csye6225
# sudo usermod -aG webappgroup admin
 
# # Set ownership and permissions for csye6225's home directory
# sudo chown -R csye6225:webappgroup /home/csye6225
# sudo chmod -R 750 /home/csye6225
 
# # Set ownership and permissions for the app.js file in admin's directory
# sudo chown csye6225:webappgroup /home/admin/web-app/app.js
# sudo chmod 750 /home/admin/web-app/app.js
 
 
# # Add csye6225 to the systemd-journal group
# sudo usermod -aG systemd-journal csye6225
 
# # Set the .env file in admin's directory
# sudo chmod 644 /home/admin/web-app/.env
 
# # Create the log file and set ownership and permissions
# sudo touch /var/log/webapp.log
# sudo chown csye6225:webappgroup /var/log/webapp.log
# sudo chmod 644 /var/log/webapp.log