<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AiSuggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'model_config_snapshot',
        'prompt_hash',
        'generated_content',
        'retrieved_chunks',
        'confidence_score',
        'processing_time_ms',
    ];

    protected $casts = [
        'model_config_snapshot' => 'array',
        'generated_content' => 'array',
        'retrieved_chunks' => 'array',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function feedback(): HasOne
    {
        return $this->hasOne(AiFeedback::class, 'suggestion_id');
    }
}
