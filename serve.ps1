# Simple PowerShell Static File Web Server
$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "Server successfully started!"
    Write-Host "You can open your browser and go to: http://localhost:$port/"
    Write-Host "Press Ctrl+C in this terminal to stop the server."
    Start-Process "http://localhost:$port"
} catch {
    Write-Host "Failed to start server on port $port. Check if port is already in use."
    Write-Host $_.Exception.Message
    exit 1
}

# Keep running to listen for requests
try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        # Default to index.html
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Decode URL path and build local file path
        $decodedPath = [System.Uri]::UnescapeDataString($urlPath)
        $filePath = Join-Path (Get-Location) $decodedPath.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            # Read all file bytes
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Identify MIME types
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                ".pdf"  { "application/pdf" }
                default { "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: File not found on this local server.")
            $response.ContentType = "text/plain"
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    }
} catch {
    Write-Host "An error occurred during server operation: $_"
} finally {
    $listener.Stop()
}
