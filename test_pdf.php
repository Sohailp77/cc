<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$html = '
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style>
.dejavu { font-family: "DejaVu Sans", sans-serif; }
.freesans { font-family: "freesans", sans-serif; }
</style>
</head>
<body>
<div class="dejavu">DejaVu: ₹ 100</div>
<div class="freesans">FreeSans: ₹ 100</div>
</body>
</html>
';

$pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);
$pdf->save(public_path('test_fonts.pdf'));
echo "Saved test_fonts.pdf\n";
