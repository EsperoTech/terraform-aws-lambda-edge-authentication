variable "name" {
  default = "terraform-aws-lambda-edge-authentication"
}

// Lambda limits https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html
variable "fn_timeout" {
  default = 3
}

variable "fn_memory_size" {
  default = 128
}

#lambda config bucket
variable "authUser" {
}

variable "authPassword" {
}

variable "cookieDomain" {
}


