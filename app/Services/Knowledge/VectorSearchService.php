<?php

namespace App\Services\Knowledge;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VectorSearchService
{
    private string $apiUrl;

    public function __construct()
    {
        $this->apiUrl = config('services.vector_search.url');
    }

    public function search(array $params): array
    {
        try {
            $response = Http::timeout(30)
                ->post($this->apiUrl . '/search', [
                    'query' => $params['query'],
                    'filters' => $params['filters'] ?? [],
                    'limit' => $params['limit'] ?? 20,
                ]);

            if ($response->failed()) {
                throw new Exception('Vector search API failed: ' . $response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Vector search error: ' . $e->getMessage());
            return ['results' => [], 'error' => true];
        }
    }
}
