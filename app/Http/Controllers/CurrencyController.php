<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CurrencyController extends Controller
{
    public function getRates()
    {
        $rates = Cache::remember('currency_rates', 60, function () {
            $response = Http::get('https://api.exchangerate-api.com/v4/latest/USD'); // Replace with your API URL
            if ($response->failed()) {
                return null;
            }
            return $response->json()['rates'] ?? [];
        });

        if (!$rates) {
            return response()->json(['error' => 'Failed to fetch rates'], 500);
        }

        return response()->json($rates);
    }

    public function getSymbols()
    {
        $path = resource_path('currency_symbols.json');
        if (!file_exists($path)) {
            return response()->json(['error' => 'Currency symbols file not found'], 500);
        }

        $symbols = json_decode(file_get_contents($path), true);
        return response()->json($symbols);
    }
}
