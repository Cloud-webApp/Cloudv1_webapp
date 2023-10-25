packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}
variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

source "amazon-ebs" "debian" {
  ami_name      = "packer-debian-ami-{{timestamp}}" #timestampx    
  source_ami    = "${var.source_ami}"
  instance_type = "t2.micro"
  region        = "${var.aws_region}"
  profile       = "GitActionUser" # aws cli profile
  ssh_username  = "${var.ssh_username}"

  ami_users = ["274348305701", "661783133001"] # acc. id
}

build {
  sources = ["source.amazon-ebs.debian"]

  provisioner "shell" {
    inline = [
      "sudo chmod a+w /home",
      "sudo chmod -R +rwx /home",
      "sudo groupadd csye6225",
      "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
    ]
  }

  provisioner "file" {
    source      = "setup.sh"
    destination = "/home/setup.sh"
  }

  provisioner "file" {
    direction   = "upload"
    source      = "./artifacts/webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y expect",
      "sudo apt-get install -y unzip",
      "sudo chmod +x /home/setup.sh",
      "sudo /home/setup.sh",
      "sudo ls",
      "sudo mkdir /opt/csye6225/web-app",
      "sudo unzip /tmp/webapp.zip -d /opt/csye6225/web-app",
      "sudo cp /opt/csye6225/web-app/systemd/my-app.service /etc/systemd/system/my-app.service",
      "cd /opt/csye6225/web-app",
      "sudo npm i",
      "sudo apt-get remove --purge -y git",
      "sudo rm -rf /home/admin/webapp.zip",
    ]
  }
  provisioner "shell" {
    inline = [
      "sudo touch /opt/csye6225/web-app/.env",
      "echo 'DB_PORT=5432' >> /opt/csye6225/web-app/.env",
      "echo 'DB_USER=csye6225' >> /opt/csye6225/web-app/.env",
      "echo 'DB_PASSWORD=password' >> /opt/csye6225/web-app/.env",
      "echo 'DB_DATABASE=csye6225' >> /opt/csye6225/web-app/.env",
      "echo 'DB_HOST=localhost' >> /opt/csye6225/web-app/.env",
      "echo 'CSVPATH=./users.csv' >> /opt/csye6225/web-app/.env"
    ]
  }

  provisioner "file" {
    source      = "systemd/my-app.service"
    destination = "/tmp/my-app.service"
  }
  provisioner "shell" {
    inline = [
      //  "sudo groupadd csye6225",
      // "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
      "sudo useradd -m webappuser",
      "sudo groupadd webappgroup",
      "sudo usermod -aG webappgroup webappuser",
      "sudo usermod -aG webappgroup admin",
      "sudo chown -R webappuser:webappgroup /home/webappuser",
      "sudo chmod -R 750 /home/webappuser",
      "sudo chown webappuser:webappgroup /home/admin/web-app/app.js",
      "sudo chmod 750 /home/admin/web-app/app.js",
      "sudo usermod -aG systemd-journal webappuser",
      "sudo chmod 644 /home/admin/web-app/.env",
      "sudo touch /var/log/webapp.log",
      "sudo chown webappuser:webappgroup /var/log/webapp.log",
      "sudo chmod 644 /var/log/webapp.log",

      "sudo cp /tmp/my-app.service /lib/systemd/system/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable my-app",
      "sudo systemctl start my-app"
    ]
  }
  post-processor "shell-local" {
    inline = [
      "pwd",
      "echo 'build complete !!! ur debian ami is ready'"

    ]
  }
}