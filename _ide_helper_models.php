<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int|null $parent_id
 * @property string $title
 * @property string|null $description
 * @property string|null $icon
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\AssetAttachment|null $pivot
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Attachment> $attachments
 * @property-read int|null $attachments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AssetAttribute> $attributes
 * @property-read int|null $attributes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Asset> $children
 * @property-read int|null $children_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Asset> $childrenRecursive
 * @property-read int|null $children_recursive_count
 * @property-read int $depth
 * @property-read Asset|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Ticket> $tickets
 * @property-read int|null $tickets_count
 * @method static \Database\Factories\AssetFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Asset withoutTrashed()
 */
	class Asset extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $asset_id
 * @property int $attachment_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Asset $asset
 * @property-read \App\Models\Attachment $attachment
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttachment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttachment whereAssetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttachment whereAttachmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttachment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttachment whereUpdatedAt($value)
 */
	class AssetAttachment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $asset_id
 * @property string $key
 * @property string|null $value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Asset $asset
 * @method static \Database\Factories\AssetAttributeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute whereAssetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssetAttribute whereValue($value)
 */
	class AssetAttribute extends \Eloquent {}
}

namespace App\Models{
/**
 * Attachment Model
 * 
 * Represents a file attachment in the system.
 *
 * @property string $title
 * @property string $description
 * @property string $file_name
 * @property string $file_path
 * @property string $mime_type
 * @property string $file_extension
 * @property int $file_size
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $url
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\AttachmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereFileExtension($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereFileName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereFileSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attachment whereUpdatedAt($value)
 */
	class Attachment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $type
 * @property string $notifiable_type
 * @property int $notifiable_id
 * @property array<array-key, mixed> $data
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model $notifiable
 * @method static \Illuminate\Notifications\DatabaseNotificationCollection<int, static> all($columns = ['*'])
 * @method static \Database\Factories\DatabaseNotificationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Notifications\DatabaseNotificationCollection<int, static> get($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification read()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification unread()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification whereNotifiableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification whereNotifiableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification whereReadAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DatabaseNotification whereUpdatedAt($value)
 */
	class DatabaseNotification extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $category
 * @property string $type
 * @property string $channel
 * @property bool $enabled
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\NotificationPreferenceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereChannel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereUserId($value)
 */
	class NotificationPreference extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $email
 * @property string $token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken whereToken($value)
 */
	class PasswordResetToken extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $guard_name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereGuardName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role withoutTrashed()
 */
	class Role extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $author_id
 * @property int $priority_id
 * @property int $status_id
 * @property int $category_id
 * @property int|null $asset_id
 * @property string $title
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Asset|null $asset
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TicketAssignee> $assignees
 * @property-read int|null $assignees_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Attachment> $attachments
 * @property-read int|null $attachments_count
 * @property-read \App\Models\TicketCategory $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TicketComment> $comments
 * @property-read int|null $comments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TicketEntry> $entries
 * @property-read int|null $entries_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TicketLog> $logs
 * @property-read int|null $logs_count
 * @property-read \App\Models\TicketPriority $priority
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TicketSchedule> $schedules
 * @property-read int|null $schedules_count
 * @property-read \App\Models\TicketStatus $status
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\TicketFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereAssetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereAuthorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket wherePriorityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Ticket withoutTrashed()
 */
	class Ticket extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $ticket_id
 * @property int $user_id
 * @property string|null $role_title
 * @property string|null $role_description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Ticket $ticket
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee whereRoleDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee whereRoleTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee whereTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAssignee whereUserId($value)
 */
	class TicketAssignee extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $ticket_id
 * @property int $attachment_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Attachment $attachment
 * @property-read \App\Models\Ticket $ticket
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAttachment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAttachment whereAttachmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAttachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAttachment whereTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketAttachment whereUpdatedAt($value)
 */
	class TicketAttachment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int $sort_order
 * @property string|null $icon
 * @property string $color
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Ticket> $tickets
 * @property-read int|null $tickets_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCategory whereUpdatedAt($value)
 */
	class TicketCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $ticket_id
 * @property int $user_id
 * @property int|null $parent_id
 * @property string $content
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Attachment> $attachments
 * @property-read int|null $attachments_count
 * @property-read TicketComment|null $parent
 * @property-read \App\Models\Ticket $ticket
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment whereTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketComment withoutTrashed()
 */
	class TicketComment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $ticket_comment_id
 * @property int $attachment_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Attachment $attachment
 * @property-read \App\Models\TicketComment $comment
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCommentAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCommentAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCommentAttachment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCommentAttachment whereAttachmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCommentAttachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCommentAttachment whereTicketCommentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketCommentAttachment whereUpdatedAt($value)
 */
	class TicketCommentAttachment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $ticket_id
 * @property int $user_id
 * @property string|null $note
 * @property Carbon $start_at
 * @property Carbon $end_at
 * @property int $duration_seconds
 * @property bool $billable
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Ticket $ticket
 * @property-read User $user
 *  * @mixin Builder
 * @method static \Database\Factories\TicketEntryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereBillable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereDurationSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereEndAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereStartAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketEntry withoutTrashed()
 */
	class TicketEntry extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $ticket_id
 * @property int $user_id
 * @property string $action
 * @property string|null $field
 * @property string|null $old_value
 * @property string|null $new_value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Ticket $ticket
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereField($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereNewValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereOldValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketLog whereUserId($value)
 */
	class TicketLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int $sort_order
 * @property string $color
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Ticket> $tickets
 * @property-read int|null $tickets_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketPriority whereUpdatedAt($value)
 */
	class TicketPriority extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $ticket_id
 * @property int $user_id
 * @property string $start_date
 * @property string $end_date
 * @property int|null $duration_minutes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property-read \App\Models\Ticket $ticket
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereDurationMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketSchedule whereUserId($value)
 */
	class TicketSchedule extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property int $sort_order
 * @property string $color
 * @property int $is_default
 * @property int $is_closed
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $progress
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Ticket> $tickets
 * @property-read int|null $tickets_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereIsClosed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TicketStatus whereUpdatedAt($value)
 */
	class TicketStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $verification_token
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $language
 * @property string $timezone
 * @property string $theme
 * @property string $color_scheme
 * @property int|null $attachment_avatar
 * @property string|null $phone
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Attachment|null $avatar
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\NotificationPreference> $notificationPreferences
 * @property-read int|null $notification_preferences_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\PasswordResetToken|null $passwordResetToken
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Role> $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User role($roles, $guard = null, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAttachmentAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereColorScheme($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTheme($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTimezone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereVerificationToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutRole($roles, $guard = null)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutTrashed()
 */
	class User extends \Eloquent implements \Illuminate\Contracts\Auth\MustVerifyEmail {}
}

