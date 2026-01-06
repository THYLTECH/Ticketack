<?php

use App\Models\Ticket;
use App\Models\Asset;
use App\Models\TicketCategory;
use App\Models\User;
use App\Services\Knowledge\VectorSearchService;
use Database\Seeders\RolesAndPermissionsSeeder;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;


beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    $this->user = User::factory()->create();
    $this->user->assignRole('admin');
    actingAs($this->user);

    $this->vectorSearchMock = Mockery::mock(VectorSearchService::class);
    $this->app->instance(VectorSearchService::class, $this->vectorSearchMock);
});

test('knowledge search page loads with filters', function () {
    $response = get(route('knowledge.search'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('knowledge/search')
            ->has('users')
            ->has('categories')
            ->has('assets')
        );
});

test('search returns vector results', function () {
    $ticket = Ticket::factory()->create([
        'title' => 'SMTP Configuration Error',
        'description' => 'Port 587 issue',
        'author_id' => $this->user->id,
    ]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.2],
        ]);

    $response = post(route('knowledge.api.search'), [
        'query' => 'SMTP error',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'results' => [
                '*' => [
                    'id',
                    'ticket_id',
                    'title',
                    'score',
                    'type',
                ],
            ],
            'total',
        ]);
});

test('search applies filters correctly', function () {
    $category = TicketCategory::factory()->create();
    $ticket = Ticket::factory()->create([
        'category_id' => $category->id,
        'author_id' => $this->user->id,
    ]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->with(Mockery::on(function ($arg) use ($category) {
            return isset($arg['filters']['category_ids'])
                && in_array($category->id, $arg['filters']['category_ids']);
        }))
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.1],
        ]);

    $response = post(route('knowledge.api.search'), [
        'query' => 'test',
        'category_id' => (string) $category->id,
    ]);

    $response->assertOk();
});

test('search handles service unavailability', function () {
    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn(['error' => 'Service unavailable']);

    $response = post(route('knowledge.api.search'), [
        'query' => 'test query',
    ]);

    $response->assertStatus(503)
        ->assertJson([
            'results' => [],
            'error' => 'Search service unavailable',
        ]);
});

test('search validates minimum query length', function () {
    post(route('knowledge.api.search'), [
        'query' => 'ab',
    ])->assertSessionHasErrors('query');
});

test('show page includes similar tickets from vector search', function () {
    $ticket = Ticket::factory()->create([
        'title' => 'Printer not working',
        'description' => 'HP LaserJet issue',
        'author_id' => $this->user->id,
    ]);

    $similarTicket = Ticket::factory()->create([
        'title' => 'Printer connection problem',
        'author_id' => $this->user->id,
    ]);

    $vectorSearchMock = Mockery::mock(VectorSearchService::class);
    $vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->with(Mockery::on(function ($arg) {
            return isset($arg['query']) && isset($arg['limit']) && $arg['limit'] === 6;
        }))
        ->andReturn([
            ['ticket_id' => $similarTicket->id, 'score' => 0.3],
        ]);

    $this->app->instance(VectorSearchService::class, $vectorSearchMock);

    get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/show')
            ->where('ticket.id', $ticket->id)
            ->has('similar_tickets', 1)
            ->where('similar_tickets.0.id', $similarTicket->id)
            ->where('similar_tickets.0.title', 'Printer connection problem')
            ->has('similar_tickets.0.similarity')
        );
});

test('show page filters out current ticket from similar results', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);

    $vectorSearchMock = Mockery::mock(VectorSearchService::class);
    $vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.0],
            ['ticket_id' => 999, 'score' => 0.2],
        ]);

    $this->app->instance(VectorSearchService::class, $vectorSearchMock);

    get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('similar_tickets', 0)
        );
});

test('show page handles vector search failure gracefully', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);

    $vectorSearchMock = Mockery::mock(VectorSearchService::class);
    $vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andThrow(new \Exception('Vector service down'));

    $this->app->instance(VectorSearchService::class, $vectorSearchMock);

    get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('similar_tickets', [])
        );
});

test('show page limits similar tickets to 6 results', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);
    $tickets = Ticket::factory()->count(10)->create(['author_id' => $this->user->id]);

    $results = $tickets->map(fn ($t, $i) => [
        'ticket_id' => $t->id,
        'score' => 0.1 * $i,
    ])->toArray();

    $vectorSearchMock = Mockery::mock(VectorSearchService::class);
    $vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn($results);

    $this->app->instance(VectorSearchService::class, $vectorSearchMock);

    get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('similar_tickets', 6)
        );
});

test('show page returns empty array when vector search returns error', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);

    $vectorSearchMock = Mockery::mock(VectorSearchService::class);
    $vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn(['error' => 'Service unavailable']);

    $this->app->instance(VectorSearchService::class, $vectorSearchMock);

    get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('similar_tickets', [])
        );
});

test('show page builds search context from ticket data', function () {
    $category = TicketCategory::factory()->create(['title' => 'Hardware']);
    $asset = Asset::factory()->create(['title' => 'Desktop PC']);

    $ticket = Ticket::factory()->create([
        'title' => 'Screen flickering',
        'description' => 'Display issues',
        'category_id' => $category->id,
        'asset_id' => $asset->id,
        'author_id' => $this->user->id,
    ]);

    $vectorSearchMock = Mockery::mock(VectorSearchService::class);
    $vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->with(Mockery::on(function ($arg) {
            return str_contains($arg['query'], 'Screen flickering')
                && str_contains($arg['query'], 'Display issues')
                && str_contains($arg['query'], 'Hardware')
                && str_contains($arg['query'], 'Desktop PC');
        }))
        ->andReturn([]);

    $this->app->instance(VectorSearchService::class, $vectorSearchMock);

    get(route('tickets.show', $ticket))->assertOk();
});

test('similarity score is calculated correctly', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);
    $similar = Ticket::factory()->create(['author_id' => $this->user->id]);

    $vectorSearchMock = Mockery::mock(VectorSearchService::class);
    $vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $similar->id, 'score' => 0.4],
        ]);

    $this->app->instance(VectorSearchService::class, $vectorSearchMock);

    get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('similar_tickets.0.similarity', 80)
        );
});

test('search returns tickets with author and category information', function () {
    $author = User::factory()->create(['name' => 'John Doe']);
    $category = TicketCategory::factory()->create(['title' => 'Network']);

    $ticket = Ticket::factory()->create([
        'title' => 'Network connectivity issue',
        'description' => 'Cannot connect to WiFi',
        'author_id' => $author->id,
        'category_id' => $category->id,
    ]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.15],
        ]);

    post(route('knowledge.api.search'), ['query' => 'network issue'])
        ->assertOk()
        ->assertJson([
            'results' => [
                [
                    'ticket_id' => $ticket->id,
                    'title' => 'Network connectivity issue',
                    'author' => ['name' => 'John Doe'],
                    'category' => 'Network',
                ]
            ]
        ]);
});

test('search filters by multiple authors', function () {
    $author1 = User::factory()->create();
    $author2 = User::factory()->create();

    $ticket1 = Ticket::factory()->create(['author_id' => $author1->id]);
    $ticket2 = Ticket::factory()->create(['author_id' => $author2->id]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $ticket1->id, 'score' => 0.1],
            ['ticket_id' => $ticket2->id, 'score' => 0.2],
        ]);

    post(route('knowledge.api.search'), [
        'query' => 'test',
        'author_id' => "{$author1->id},{$author2->id}",
    ])
        ->assertOk()
        ->assertJsonCount(2, 'results');
});

test('search filters by date range', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'created_at' => now()->subDays(5),
    ]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->with(Mockery::on(function ($arg) {
            return isset($arg['filters']['date_from'])
                && isset($arg['filters']['date_to']);
        }))
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.1],
        ]);

    post(route('knowledge.api.search'), [
        'query' => 'test',
        'date_from' => now()->subWeek()->format('Y-m-d'),
        'date_to' => now()->format('Y-m-d'),
    ])
        ->assertOk()
        ->assertJsonCount(1, 'results');
});

test('search excludes tickets outside date range', function () {
    $oldTicket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'created_at' => now()->subMonths(2),
    ]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $oldTicket->id, 'score' => 0.1],
        ]);

    post(route('knowledge.api.search'), [
        'query' => 'test',
        'date_from' => now()->subWeek()->format('Y-m-d'),
        'date_to' => now()->format('Y-m-d'),
    ])
        ->assertOk()
        ->assertJsonCount(0, 'results');
});

test('search includes solution for referenced tickets', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'is_referenced' => true,
        'detailed_solution' => 'Detailed fix steps',
    ]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.1],
        ]);

    post(route('knowledge.api.search'), ['query' => 'test'])
        ->assertOk()
        ->assertJson([
            'results' => [
                [
                    'ticket_id' => $ticket->id,
                    'solution' => 'Detailed fix steps',
                    'has_solution' => true,
                ]
            ]
        ]);
});

test('search excludes solution for non-referenced tickets', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'is_referenced' => false,
        'detailed_solution' => 'Should not appear',
    ]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.1],
        ]);

    post(route('knowledge.api.search'), ['query' => 'test'])
        ->assertOk()
        ->assertJson([
            'results' => [
                [
                    'ticket_id' => $ticket->id,
                    'solution' => null,
                    'has_solution' => false,
                ]
            ]
        ]);
});

test('search respects limit parameter', function () {
    $tickets = Ticket::factory()->count(30)->create(['author_id' => $this->user->id]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->with(Mockery::on(fn($arg) => $arg['limit'] === 10))
        ->andReturn($tickets->take(10)->map(fn($t) => [
            'ticket_id' => $t->id,
            'score' => 0.1,
        ])->toArray());

    post(route('knowledge.api.search'), [
        'query' => 'test',
        'limit' => 10,
    ])
        ->assertOk()
        ->assertJsonCount(10, 'results');
});

test('search normalizes similarity scores correctly', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.6],
        ]);

    post(route('knowledge.api.search'), ['query' => 'test'])
        ->assertOk()
        ->assertJson([
            'results' => [
                ['score' => 0.7]
            ]
        ]);
});

test('search filters null ticket_id results', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.1],
            ['score' => 0.2],
            ['ticket_id' => null, 'score' => 0.15],
        ]);

    post(route('knowledge.api.search'), ['query' => 'test'])
        ->assertOk()
        ->assertJsonCount(1, 'results');
});

test('search combines filters correctly', function () {
    $category = TicketCategory::factory()->create();
    $asset = Asset::factory()->create();
    $author = User::factory()->create();

    $ticket = Ticket::factory()->create([
        'author_id' => $author->id,
        'category_id' => $category->id,
        'asset_id' => $asset->id,
    ]);

    $this->vectorSearchMock
        ->shouldReceive('search')
        ->once()
        ->with(Mockery::on(function ($arg) use ($category, $asset, $author) {
            return in_array($category->id, $arg['filters']['category_ids'] ?? [])
                && in_array($asset->id, $arg['filters']['asset_ids'] ?? [])
                && in_array($author->id, $arg['filters']['author_ids'] ?? []);
        }))
        ->andReturn([
            ['ticket_id' => $ticket->id, 'score' => 0.1],
        ]);

    post(route('knowledge.api.search'), [
        'query' => 'test',
        'category_id' => (string) $category->id,
        'asset_id' => (string) $asset->id,
        'author_id' => (string) $author->id,
    ])
        ->assertOk()
        ->assertJsonCount(1, 'results');
});


