variable "location" {
  default = "East US"
}

variable "resource_group_name" {
  default = "k8s-cluster-rg"
}

variable "vnet_name" {
  default = "k8s-vnet"
}

variable "subscription_id" {
  type= string
}

variable "address_space" {
  default = ["10.0.0.0/16"]
}

variable "public_subnet_name" {
  default = "master-subnet"

}
variable "public_subnet_prefix" {
  default = ["10.0.1.0/24"]
}

variable "private_subnet_name" {
  default = "worker-subnet"
}

variable "private_subnet_prefix" {
  default = ["10.0.2.0/24"]

}
variable "master_vm_name" {
  default = "k8s-master"

}

variable "worker1_vm_name" {
  default = "k8s-worker-1"

}
variable "worker2_vm_name" {
  default = "k8s-worker-2"
}

variable "vm_size" {
  default = "Standard_B2s"
}

variable "admin_username" {
 type= string 
}

variable "admin_password" {
  type = string 
}

variable "environment" {
  default = "dev"

}
variable "acr_name" {
  type = string

}