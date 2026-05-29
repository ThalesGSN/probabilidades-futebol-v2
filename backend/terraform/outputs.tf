output "cloudfront_url" {
  description = "URL do CDN — usar como VITE_DATA_BASE_URL no Vercel"
  value       = "https://${aws_cloudfront_distribution.data.domain_name}"
}

output "s3_bucket_name" {
  description = "Nome do bucket S3 de dados"
  value       = aws_s3_bucket.data.bucket
}

output "lambda_function_name" {
  description = "Nome da Lambda para invocação manual de teste"
  value       = aws_lambda_function.data_pipeline.function_name
}

output "lambda_log_group" {
  description = "CloudWatch Log Group da Lambda"
  value       = "/aws/lambda/${aws_lambda_function.data_pipeline.function_name}"
}
