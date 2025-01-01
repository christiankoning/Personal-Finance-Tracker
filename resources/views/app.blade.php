<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Finance Tracker</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css']) <!-- Include React -->
</head>
<body>
    <div id="app"></div> <!-- React mounts here -->
</body>
</html>
