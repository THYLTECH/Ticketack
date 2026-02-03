<?php

namespace Tests;

use AllowDynamicProperties;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

/**
 * @property \App\Models\User $user
 */
#[AllowDynamicProperties]
abstract class TestCase extends BaseTestCase
{
    public $user;
    public $testUser1;
    public $testUser2;
    public $roleAdmin;
    public $roleBasic;
}
