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


  provisioner "file" {
    direction   = "upload"
    source      = "./artifacts/webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "systemd/my-app.service"
    destination = "/tmp/my-app.service"
  }
  provisioner "file" {
    source      = "setup.sh"
    destination = "/tmp/setup.sh"
  }

  provisioner "shell" {
    inline = [
      "sudo chmod a+w /home",
      "sudo chmod -R +rwx /home",
      "chmod +x /tmp/setup.sh",
      "/tmp/setup.sh",
    ]
  }

  post-processor "shell-local" {
    inline = [
      "pwd",
      "echo 'build complete !!! ur debian ami is ready'"

    ]
  }
}
