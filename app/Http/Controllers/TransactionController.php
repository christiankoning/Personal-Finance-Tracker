<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())->get();
        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'category' => $request->category,
            'amount' => $request->amount,
            'description' => $request->description,
            'transaction_date' => $request->transaction_date,
        ]);

        return response()->json($transaction, 201);
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'transaction_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $transaction->update($request->all());

        return response()->json($transaction);
    }

    public function destroy($id)
    {
        $transaction = Transaction::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully']);
    }
}
