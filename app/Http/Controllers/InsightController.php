<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InsightController extends Controller
{
    /**
     * Spending trends grouped by month.
     */
    public function spendingTrends()
    {
        $userId = Auth::id();

        $data = Transaction::selectRaw('DATE_FORMAT(transaction_date, "%Y-%m") as month, category, SUM(amount) as total')
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->groupBy('month', 'category')
            ->orderBy('month')
            ->get();

        return response()->json($data, 200);
    }

    /**
     * Income trends grouped by month.
     */
    public function incomeTrends()
    {
        $userId = Auth::id();

        $data = Transaction::selectRaw('DATE_FORMAT(transaction_date, "%Y-%m") as month, SUM(amount) as total')
            ->where('user_id', $userId)
            ->where('type', 'income')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data, 200);
    }

    /**
     * Budget adherence metrics.
     */
    public function budgetAdherence()
    {
        $userId = Auth::id();

        $budgets = Budget::where('user_id', $userId)->get();
        $transactions = Transaction::selectRaw('category, SUM(amount) as total_spent')
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->groupBy('category')
            ->get();

        $data = $budgets->map(function ($budget) use ($transactions) {
            $spent = $transactions->firstWhere('category', $budget->category)?->total_spent ?? 0;

            return [
                'category' => $budget->category,
                'budget' => $budget->amount,
                'spent' => $spent,
                'adherence' => min(($spent / $budget->amount) * 100, 100), // Percentage spent
            ];
        });

        return response()->json($data, 200);
    }
}
