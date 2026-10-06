<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_registration_screen_is_not_available(): void
    {
        $this->get('/register')->assertNotFound();
    }

    public function test_public_registration_endpoint_is_not_available(): void
    {
        $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'A-Strong-Test-Passphrase-123',
            'password_confirmation' => 'A-Strong-Test-Passphrase-123',
        ])->assertNotFound();

        $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);
    }
}
