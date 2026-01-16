<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiFeedback extends Model
{
    use HasFactory;

    protected $table = 'ai_feedbacks';

    protected $fillable = [
        'suggestion_id',
        'user_id',
        'action_type',
        'final_content',
        'rejection_reason',
        'rejection_comment',
    ];

    public function suggestion(): BelongsTo
    {
        return $this->belongsTo(AiSuggestion::class, 'suggestion_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
