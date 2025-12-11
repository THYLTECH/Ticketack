<?php

namespace Tests\Unit;

use App\Models\Asset;
use App\Models\AssetAttachment;
use App\Models\AssetAttribute;
use App\Models\Attachment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AssetModelsTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function attachment_model_has_correct_url_accessor()
    {
        Storage::fake('public');

        $attachment = new Attachment([
            'file_path' => 'assets/1/test.jpg',
        ]);

        $expectedUrl = Storage::url('assets/1/test.jpg');
        $this->assertEquals($expectedUrl, $attachment->getUrl());
        $this->assertEquals($expectedUrl, $attachment->url);

        $emptyAttachment = new Attachment(['file_path' => null]);
        $this->assertEquals('', $emptyAttachment->url);
    }

    #[Test]
    public function attachment_belongs_to_user_avatar()
    {
        $attachment = Attachment::factory()->create();
        $user = User::factory()->create(['attachment_avatar' => $attachment->id]);

        $this->assertTrue($attachment->user()->exists());
        $this->assertEquals($user->id, $attachment->user->id);
    }

    #[Test]
    public function asset_attachment_pivot_relations()
    {
        $asset = Asset::factory()->create();
        $attachment = Attachment::factory()->create();

        $pivot = AssetAttachment::create([
            'asset_id' => $asset->id,
            'attachment_id' => $attachment->id
        ]);

        $this->assertInstanceOf(Asset::class, $pivot->asset);
        $this->assertInstanceOf(Attachment::class, $pivot->attachment);
        $this->assertEquals($asset->id, $pivot->asset->id);
    }

    #[Test]
    public function asset_attribute_relation()
    {
        $asset = Asset::factory()->create();
        $attribute = AssetAttribute::create([
            'asset_id' => $asset->id,
            'key' => 'Test Key',
            'value' => 'Test Value'
        ]);

        $this->assertInstanceOf(Asset::class, $attribute->asset);
        $this->assertEquals($asset->id, $attribute->asset->id);
    }
}
