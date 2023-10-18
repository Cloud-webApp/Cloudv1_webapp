#!/bin/bash
# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

sudo apt install unzip

# Install PostgreSQL and related packages
sudo apt install -y postgresql postgresql-contrib
# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm
# Check Node.js version
nodejs -v
# Configure PostgreSQL: set password, create database, and create user
# sudo -u postgres createuser --interactive --pwprompt postgres
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
# sudo -u postgres createdb altafsmba



# Navigate to /opt directory
# cd /tmp

# # Unzip
# sudo apt-get install unzip
# sudo unzip webapp.zip -d /opt/webapp

# cd /opt
# sudo npm install


