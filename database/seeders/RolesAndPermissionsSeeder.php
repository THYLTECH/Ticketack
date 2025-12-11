<?php

// database/seeders/RolesAndPermissionsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

// Models
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Seed roles and permissions into the database.
 *
 * This seeder creates default roles and permissions for the application.
 *
 * @package Database\Seeders
 */
class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        /**
         * Permissions
         */

        $permissions = [
            // Assets
            'view assets', 'show assets', 'create assets', 'update assets',
            'delete assets', 'restore assets', 'force delete assets',
            // Users
            'view users', 'show users', 'create users', 'update users',
            'delete users',
            // Roles
            'view roles', 'show roles', 'create roles', 'update roles',
            'delete roles',

            //Trash
            'view trash', 'edit trash'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        /**
         * Roles
         */

        // Admin
        $roleAdmin = Role::firstOrCreate(['name' => 'admin']);

        // Sync permissions (avoid duplicates)
        $roleAdmin->syncPermissions(Permission::all());

        // Solver

        // User
    }
}
