<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Budget;
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
}
