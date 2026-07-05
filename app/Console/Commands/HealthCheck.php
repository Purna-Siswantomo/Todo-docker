<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('health:check')]
#[Description('Health check endpoint')]
class HealthCheck extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        try {
            DB::connection()->getPdo();
            $this->info('Database connection: OK');
            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Database connection failed: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}