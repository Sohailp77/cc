<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Quotation {{ $quote->reference_id }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            color: #333;
            line-height: 1.5;
        }
        .header {
            width: 100%;
            border-bottom: 2px solid #ddd;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4F46E5; /* Indigo-600 */
        }
        .meta-table {
            width: 100%;
            margin-bottom: 30px;
        }
        .meta-table td {
            vertical-align: top;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background-color: #f3f4f6;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            border-bottom: 1px solid #ddd;
        }
        .items-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }
        .totals-table {
            width: 40%;
            float: right;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 8px;
            text-align: right;
        }
        .total-row {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #333;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%">
            <tr>
                <td>
                    <div class="logo">Ceramic Center</div>
                    <div>info@ceramiccenter.com</div>
                    <div>+91 98765 43210</div>
                </td>
                <td style="text-align: right">
                    <h1 style="margin: 0; font-size: 28px; color: #111;">QUOTATION</h1>
                    <div style="color: #666; font-weight: bold;">#{{ $quote->reference_id }}</div>
                    <div>Date: {{ $quote->created_at->format('d M, Y') }}</div>
                    <div>Valid Until: {{ $quote->valid_until ? $quote->valid_until->format('d M, Y') : 'N/A' }}</div>
                </td>
            </tr>
        </table>
    </div>

    <table class="meta-table">
        <tr>
            <td style="width: 50%">
                <strong>Bill To:</strong><br>
                {{ $quote->customer_name }}<br>
                @if($quote->customer_phone) Phone: {{ $quote->customer_phone }}<br> @endif
                @if($quote->customer_email) Email: {{ $quote->customer_email }}<br> @endif
            </td>
            <td style="width: 50%; text-align: right;">
                <strong>Company Details:</strong><br>
                GSTIN: 27ABCDE1234F1Z5<br>
                New Delhi, India
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%">#</th>
                <th style="width: 10%">Image</th>
                <th style="width: 40%">Item Description</th>
                <th style="width: 15%">Unit Price</th>
                <th style="width: 10%">Qty</th>
                <th style="width: 20%; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quote->items as $index => $item)
            @php
                $imagePath = null;
                if ($item->variant && $item->variant->image_path) {
                    $imagePath = $item->variant->image_path;
                } elseif ($item->product->image_path) {
                    $imagePath = $item->product->image_path;
                } elseif ($item->product->category && $item->product->category->image_path) {
                    $imagePath = $item->product->category->image_path;
                }

                // Fix for /storage/ prefix in DB
                if ($imagePath && str_starts_with($imagePath, '/storage/')) {
                    $imagePath = substr($imagePath, 9); // Remove /storage/
                }
            @endphp
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    @if($imagePath)
                        <img src="{{ public_path('storage/' . $imagePath) }}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                    @else
                        <div style="width: 40px; height: 40px; background-color: #000000ff; border-radius: 4px;"></div>
                    @endif
                </td>
                <td>
                    <strong>{{ $item->product->name }}</strong>
                    @if($item->variant)
                        <br><span style="color: #666; font-size: 12px;">Variant: {{ $item->variant->name }}</span>
                    @endif
                    <br><span style="color: #888; font-size: 11px;">Category: {{ $item->product->category->name }}</span>
                </td>
                <td>{{ number_format($item->price, 2) }}</td>
                <td>{{ $item->quantity }} {{ $item->product->category->unit_name }}</td>
                <td style="text-align: right;">{{ number_format($item->price * $item->quantity, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals-table">
        <tr>
            <th class="text-right">Subtotal:</th>
            <td class="text-right">{{ number_format($quote->subtotal, 2) }}</td>
        </tr>
        @if($quote->discount_amount > 0)
        <tr>
            <th class="text-right">Discount ({{ number_format($quote->discount_percentage, 1) }}%):</th>
            <td class="text-right text-red">-{{ number_format($quote->discount_amount, 2) }}</td>
        </tr>
        <tr>
            <th class="text-right">Taxable Amount:</th>
            <td class="text-right">{{ number_format($quote->subtotal - $quote->discount_amount, 2) }}</td>
        </tr>
        @endif
        <tr>
            <th class="text-right">
                @if($quote->gst_type == 'igst')
                    IGST ({{ number_format($quote->gst_rate, 0) }}%):
                @else
                    CGST+SGST ({{ number_format($quote->gst_rate, 0) }}%):
                @endif
            </th>
            <td class="text-right">{{ number_format($quote->tax_amount, 2) }}</td>
        </tr>
        <tr class="total-row">
            <th class="text-right">Total:</th>
            <td class="text-right">{{ number_format($quote->total_amount, 2) }}</td>
        </tr>
    </table>

    <div style="clear: both; margin-top: 50px;"></div>

    @if($quote->notes)
    <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
        <strong>Notes / Terms:</strong><br>
        {{ $quote->notes }}
    </div>
    @endif

    <div style="margin-top: 40px; border-top: 2px solid #eee; padding-top: 20px;">
        <table style="width: 100%">
            <tr>
                <td style="width: 60%">
                    <strong>Bank Details for Payment:</strong><br>
                    Bank Name: <strong>HDFC Bank</strong><br>
                    Account Name: <strong>Ceramic Center</strong><br>
                    Account No: <strong>50200012345678</strong><br>
                    IFSC Code: <strong>HDFC0001234</strong><br>
                    Branch: <strong>New Delhi, Main Branch</strong>
                </td>
                <td style="width: 40%; text-align: right; vertical-align: bottom;">
                    <br><br><br>
                    __________________________<br>
                    <strong>Authorized Signatory</strong><br>
                    For Ceramic Center
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Thank you for your business! | This is a computer-generated quotation.
    </div>
</body>
</html>
