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
        ]);

        $budget = Budget::create([
            'user_id' => Auth::id(),
            'category' => $request->category,
            'amount' => $request->amount,
        ]);

        return response()->json($budget, 201);
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric',
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
            $spending = Transaction::selectRaw('category, SUM(amount) as total_spent')
                ->where('user_id', $userId)
                ->where('type', 'expense')
                ->where('transaction_date', 'like', "{$currentMonth}%")
                ->groupBy('category')
                ->get();

            $budgets = Budget::where('user_id', $userId)->get();

            $data = $budgets->map(function ($budget) use ($spending) {
                $spent = $spending->firstWhere('category', $budget->category)?->total_spent ?? 0;
                return [
                    'category' => $budget->category,
                    'budget' => $budget->amount,
                    'spent' => (float) $spent, // Ensure spent is always a float
                ];
            });

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


}
