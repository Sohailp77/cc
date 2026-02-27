<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = User::where('role', 'employee')
            ->withCount('quotes')
            ->withSum('quotes', 'total_amount')
            ->orderByDesc('quotes_count')
            ->get();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
        ]);
    }

    public function create()
    {
        return Inertia::render('Employees/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'employee',
        ]);

        return redirect()->route('employees.index')
            ->with('success', 'Employee account created successfully.');
    }

    public function destroy(User $employee)
    {
        if ($employee->isBoss()) {
            return back()->with('error', 'Cannot delete a boss account.');
        }

        $employee->delete();

        return back()->with('success', 'Employee removed.');
    }
}
