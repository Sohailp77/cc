<?php

namespace App\Exports;

use App\Models\Quote;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class QuoteExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $quote;

    public function __construct(Quote $quote)
    {
        $this->quote = $quote;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->quote->items;
    }

    public function headings(): array
    {
        return [
            ['QUOTATION REF: ' . $this->quote->reference_id],
            ['To: ' . ($this->quote->customer_name ?? 'Valued Customer')],
            ['Date: ' . $this->quote->updated_at->format('d-M-Y')],
            [],
            ['Product Name', 'Variant / Item', 'Unit', 'Price', 'Quantity', 'Total'],
        ];
    }

    public function map($item): array
    {
        $variantName = $item->variant ? $item->variant->name : '-';
        $unitName = $item->product->category->unit_name;
        
        return [
            $item->product->name,
            $variantName,
            $unitName,
            $item->price,
            $item->quantity,
            $item->price * $item->quantity,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Bold the reference info
            1    => ['font' => ['bold' => true, 'size' => 14]],
            2    => ['font' => ['bold' => true]],
            3    => ['font' => ['italic' => true]],
            
            // Header Row (Row 5)
            5    => ['font' => ['bold' => true], 'fill' => ['fillType' => 'solid', 'startColor' => ['argb' => 'FFE0E0E0']]],
        ];
    }
}
