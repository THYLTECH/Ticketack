<?php

use App\Http\Controllers\API\UserController;
use App\Http\Controllers\Api\AttachmentController;

Route::get('/users', [UserController::class, 'index']);
Route::get('/attachments', [AttachmentController::class, 'index']);


