terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.92.0"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}


resource "azurerm_resource_group" "front_end_rg" {
  name     = "myTFResourceGroup"
  location = "southeastasia"
}

resource "azurerm_storage_account" "front_end_storage_account" {
  name                     = "bkbstgsandfrontendne001"
  resource_group_name      = azurerm_resource_group.front_end_rg.name
  location                 = "southeastasia"
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  


  static_website {
    index_document = "index.html"
  }
}