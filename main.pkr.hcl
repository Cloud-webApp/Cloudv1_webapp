packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

source "amazon-ebs" "debian" {
  ami_name      = "packer-debian-ami-{{timestamp}}" #timestampx    
  source_ami    = "ami-06db4d78cb1d3bbf9"
  instance_type = "t2.micro"
  region        = "us-east-1"
  profile       = "GitActionUser" # aws cli profile
  ssh_username  = "admin"

  ami_users = ["274348305701", "661783133001"] # acc. id
}

build {
  sources = ["source.amazon-ebs.debian"]

  provisioner "file" {
  source      = "artifacts/webapp.zip"  # Path to your zipped artifact
  destination = "/tmp/webapp.zip"
  direction   = "upload"
}

provisioner "file" {
  source      = "setup.sh"
  destination = "/tmp/setup.sh"
}

  post-processor "shell-local" {
    inline = [
      "pwd",
      "echo 'build complete !!! ur debian ami is ready'"

    ]
  }
}