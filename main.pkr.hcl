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


variable "profile" {
  type    = string
  default = "GitActionUser"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "ami_name_prefix" {
  type    = string
  default = "packer-debian-ami"
}

variable "dev_id" {
  type        = string
  description = "AWS dev account ID"
  default     = "274348305701"
}

variable "prod_id" {
  type        = string
  description = "AWS prod account ID"
  default     = "661783133001"
}


source "amazon-ebs" "debian" {
  ami_name      = "${var.ami_name_prefix}-{{timestamp}}"
  source_ami    = "${var.source_ami}"
  instance_type = "${var.instance_type}"
  region        = "${var.aws_region}"
  profile       = "${var.profile}"
  ssh_username  = "${var.ssh_username}"

  ami_users = [
    "${var.dev_id}",  # dev account ID
    "${var.prod_id}", # prod account ID
  ]
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
