packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  } //altaf
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
    ]
  }

  provisioner "file" {
    source      = "setup.sh"
    destination = "/home/setup.sh"
  }

  provisioner "file" {
    direction   = "upload"
    source      = "./artifacts/webapp.zip"
    destination = "webapp.zip"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y expect",
      "sudo apt-get install -y unzip",
      "sudo chmod +x /home/setup.sh",

      "sudo ls",
      "sudo apt-get install unzip",
      "mkdir web-app",
      "sudo unzip webapp.zip -d web-app",
      "cd web-app",

      "sudo /home/setup.sh",

      "sudo npm i",
      "sudo apt-get remove --purge -y git"
    ]
  }
  provisioner "file" {
    source      = "systemd/my-app.service"
    destination = "/tmp/my-app.service"
  }
  provisioner "shell" {
    inline = [

      "sudo useradd -m webappuser",
      "sudo groupadd webappuser",

      //adding webappuser and admin to the webappuser
      "sudo usermod -aG webappuser webappuser",
      "sudo usermod -aG webappuser admin",

      // ownership and permissions for webappuser's home directory
      "sudo chown -R webappuser:webappuser /home/webappuser",
      "sudo chmod -R 750 /home/webappuser",

      // ownership and permissions for the app.js file in admin's directory
      "sudo chown webappuser:webappuser /home/admin/web-app/app.js",
      "sudo chmod 750 /home/admin/web-app/app.js",
      //Add webappuser to the systemd-journal group
      "sudo usermod -aG systemd-journal webappuser",
      // .env file in admin's directory
      "sudo chmod 644 /home/admin/web-app/.env",
      //Create the log file and set ownership and permissions
      "sudo touch /var/log/webapp.log",
      "sudo chown webappuser:webappuser /var/log/webapp.log",
      "sudo chmod 644 /var/log/webapp.log",

      // ownership to webappuser in admin's directory
      "sudo chown -R webappuser:webappuser /home/admin/web-app",
      "sudo chmod -R 750 /home/admin/web-app",

      "sudo cp /tmp/my-app.service /lib/systemd/system/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable my-app",
      "sudo systemctl start my-app"
      //  "sudo groupadd csye6225",
      // "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
    ]
  }
  post-processor "shell-local" {
    inline = [
      "pwd",
      "echo 'build complete !!! ur debian ami is ready'"

    ]
  }
}
