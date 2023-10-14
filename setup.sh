#!/bin/bash
# Update and upgrade packages
sudo apt update
sudo apt upgrade -y
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
sudo -u postgres createuser --interactive --pwprompt altafsmba
sudo -u postgres psql -c "ALTER USER altafsmba WITH PASSWORD 'password';"
sudo -u postgres createdb altafsmba