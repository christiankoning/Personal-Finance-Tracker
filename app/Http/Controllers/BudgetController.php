<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function index()
    {
        return Budget::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'currency' => 'required|string|max:3',
        ]);

        $budget = Budget::create([
            'user_id' => Auth::id(),
            'category' => $request->category,
            'amount' => $request->amount,
            'currency' => $request->currency,
        ]);

        return response()->json($budget, 201);
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'currency' => 'required|string|max:3',
        ]);

        $budget->update($request->all());

        return response()->json($budget);
    }

    public function destroy($id)
    {
        $budget = Budget::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $budget->delete();

        return response()->json(['message' => 'Budget deleted successfully']);
    }

    public function getSpending()
    {
        $userId = Auth::id();
        $currentMonth = now()->format('Y-m');

        try {
            $spending = Transaction::selectRaw('category, SUM(amount) as total_spent, currency')
                ->where('user_id', $userId)
                ->where('type', 'expense')
                ->where('transaction_date', 'like', "{$currentMonth}%")
                ->groupBy('category', 'currency')
                ->get();

            $currencyController = new CurrencyController();
            $exchangeRates = $currencyController->getRates()->getData();

            if (!isset($exchangeRates->error)) {
                $exchangeRates = (array) $exchangeRates;
            } else {
                throw new \Exception('Failed to retrieve exchange rates.');
            }

            $budgets = Budget::where('user_id', $userId)->get();

            $data = $budgets->map(function ($budget) use ($spending, $exchangeRates) {
                $transactions = $spending->filter(fn($s) => $s->category === $budget->category);

                $spent = $transactions->sum(function ($transaction) use ($budget, $exchangeRates) {
                    $transactionCurrency = $transaction->currency;
                    $transactionAmount = $transaction->total_spent;

                    if ($transactionCurrency !== $budget->currency) {
                        $rate = $exchangeRates[$transactionCurrency] ?? 1;
                        $budgetRate = $exchangeRates[$budget->currency] ?? 1;
                        return ($transactionAmount / $rate) * $budgetRate;
                    }

                    return $transactionAmount;
                });

                return [
                    'category' => $budget->category,
                    'budget' => $budget->amount,
                    'spent' => round($spent, 2),
                    'currency' => $budget->currency,
                ];
            });

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
