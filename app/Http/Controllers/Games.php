<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Countdown;
use DateTime;

class Games extends Controller
{
    public function store(Request $request)
{
    \Log::info('Incoming request data: ', $request->all());

    // Validate incoming request data
    $request->validate([
        '*.cave' => 'required|string',
        '*.location' => 'required|string',
        '*.start_time' => 'required|date_format:d/m/Y H:i:s',
        '*.end_time' => 'required|date_format:d/m/Y H:i:s',
    ]);

    $responses = []; // Array to hold responses

    foreach ($request->all() as $countdown) {
        try {
            // Convert to MySQL DATETIME format
            $startTime = DateTime::createFromFormat('d/m/Y H:i:s', $countdown['start_time']);
            $endTime = DateTime::createFromFormat('d/m/Y H:i:s', $countdown['end_time']);

            // Check if date conversion was successful
            if (!$startTime || !$endTime) {
                throw new \Exception('Invalid date format');
            }

            // Format the date to MySQL DATETIME format
            $startTimeFormatted = $startTime->format('Y-m-d H:i:s');
            $endTimeFormatted = $endTime->format('Y-m-d H:i:s');

            // Use updateOrCreate to avoid duplicates
            $countdownRecord = Countdown::updateOrCreate(
                ['cave_name' => $countdown['cave'], 'location' => $countdown['location']],
                [
                    'start_time' => $startTimeFormatted,
                    'end_time' => $endTimeFormatted,
                    'location' => $countdown['location'], // Include location here
                ]
            );

            // Add to responses
            $responses[] = $countdownRecord;

        } catch (\Exception $e) {
            \Log::error('Error saving countdown for cave ' . $countdown['cave'] . ': ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error saving countdown data.'], 500);
        }
    }

    return response()->json(['success' => true, 'data' => $responses]);
}
    
    
public function retrieve(Request $request)
{
    try {
        $countdowns = Countdown::all();

        if ($countdowns->isNotEmpty()) {
            return response()->json(['success' => true, 'data' => $countdowns]);
        }

        return response()->json(['success' => false, 'message' => 'No countdowns found']);
    } catch (\Exception $e) {
        \Log::error('Error retrieving countdowns: '.$e->getMessage());
        return response()->json(['success' => false, 'message' => 'An error occurred while retrieving countdowns.']);
    }
}

    

}
