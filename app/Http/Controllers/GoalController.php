<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    /**
     * Display a listing of the user's goals.
     */
    public function index()
    {
        $userId = Auth::id();

        // Fetch all goals for the user
        $goals = Goal::where('user_id', $userId)->get();

        // Retrieve income transactions grouped by category
        $transactions = Transaction::selectRaw('category, SUM(amount) as total_income')
            ->where('user_id', $userId)
            ->where('type', 'income') // Ensure only income transactions
            ->groupBy('category')
            ->get();

        // Map income transactions to goals
        $data = $goals->map(function ($goal) use ($transactions) {
            $income = $transactions->firstWhere('category', $goal->category)?->total_income ?? 0;

            return [
                'id' => $goal->id,
                'category' => $goal->category,
                'amount' => $goal->amount,
                'deadline' => $goal->deadline,
                'progress' => (float) $income, // Ensure progress is a float
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
            'deadline' => 'nullable|date',
        ]);

        $goal = Goal::create([
            'user_id' => Auth::id(),
            'category' => $validated['category'],
            'amount' => $validated['amount'],
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
