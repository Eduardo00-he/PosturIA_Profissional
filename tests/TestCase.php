<?php

namespace Tests;

use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Os testes exercitam autenticação e autorização do backend.
        // A proteção CSRF é validada no fluxo HTTP/browser separado.
        $this->withoutMiddleware(PreventRequestForgery::class);
    }
}
