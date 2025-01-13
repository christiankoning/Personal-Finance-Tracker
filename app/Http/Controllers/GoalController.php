<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CurrencyController;

class GoalController extends Controller
{
    /**
     * Display a listing of the user's goals with progress.
     */
    public function index()
    {
        $userId = Auth::id();

        $goals = Goal::where('user_id', $userId)->get();

        $transactions = Transaction::selectRaw('category, currency, SUM(amount) as total_income')
            ->where('user_id', $userId)
            ->where('type', 'income')
            ->groupBy('category', 'currency')
            ->get();

        // Fetch rates from CurrencyController
        $currencyController = new CurrencyController();
        $rates = $currencyController->getRates()->getData();

        if (isset($rates->error)) {
            return response()->json(['error' => 'Failed to fetch exchange rates'], 500);
        }

        $data = $goals->map(function ($goal) use ($transactions, $rates) {
            $relatedTransactions = $transactions->where('category', $goal->category);

            $income = $relatedTransactions->reduce(function ($total, $transaction) use ($goal, $rates) {
                $transactionCurrency = $transaction->currency ?? 'USD';
                if (!isset($rates->{$transactionCurrency}) || !isset($rates->{$goal->currency})) {
                    return $total;
                }

                $convertedAmount = ($transaction->total_income / $rates->{$transactionCurrency}) * $rates->{$goal->currency};
                return $total + $convertedAmount;
            }, 0);

            return [
                'id' => $goal->id,
                'category' => $goal->category,
                'amount' => $goal->amount,
                'currency' => $goal->currency,
                'deadline' => $goal->deadline,
                'progress' => round($income, 2),
            ];
        });

        return response()->json($data, 200);
    }

    /**
     * Store a newly created goal.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'deadline' => 'nullable|date',
        ]);

        $goal = Goal::create([
            'user_id' => Auth::id(),
            'category' => $validated['category'],
            'amount' => $validated['amount'],
            'currency' => $validated['currency'],
            'deadline' => $validated['deadline'] ?? null,
        ]);

        return response()->json($goal, 201);
    }

    /**
     * Update the specified goal.
     */
    public function update(Request $request, $id)
    {
        $goal = Goal::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'deadline' => 'nullable|date',
        ]);

        $goal->update($validated);

        return response()->json($goal, 200);
    }

    /**
     * Remove the specified goal.
     */
    public function destroy($id)
    {
        $goal = Goal::where('user_id', Auth::id())->findOrFail($id);
        $goal->delete();

        return response()->json(['message' => 'Goal deleted successfully'], 200);
    }
}
