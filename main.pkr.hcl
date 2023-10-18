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
    ]
  }
  provisioner "file" {
    source      = "webapp.zip"
    destination = "webapp.zip"
    generated   = true
  }

  #create provisioner for inline
  // provisioner "shell" {
  //   script = "setup.sh"
  // }
  // provisioner "shell" {
  //   inline = [
  //     "sudo apt-get update",
  //     "sudo apt-get install -y unzip",
  //     "sudo chmod +x /home/setup.sh",
  //     "sudo /home/setup.sh",
  //     "sudo ls",
  //     "sudo apt-get install unzip",
  //     "mkdir webapp",
  //     "sudo unzip webapp.zip -d webapp",
  //     "cd webapp",
  //     "sudo npm i",
  //   ]
  // }
  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y unzip",
      "sudo chmod +x /home/setup.sh",
      "sudo /home/setup.sh",
    ]
  }

  post-processor "shell-local" {
    inline = [
      "pwd",
      "echo 'build complete !!! ur debian ami is ready'"

    ]
  }
}