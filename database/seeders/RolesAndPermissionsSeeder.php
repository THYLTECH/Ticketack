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

        // Assets
        Permission::create(['name' => 'view assets']); // Index
        Permission::create(['name' => 'show assets']); // Show
        Permission::create(['name' => 'create assets']); // Create
        Permission::create(['name' => 'edit assets']); // Edit
        Permission::create(['name' => 'store assets']); // Store
        Permission::create(['name' => 'update assets']); // Update
        Permission::create(['name' => 'delete assets']); // Delete

        // Users
        Permission::create(['name' => 'view users']); // Index
        Permission::create(['name' => 'show users']); // Show
        Permission::create(['name' => 'create users']); // Create
        Permission::create(['name' => 'edit users']); // Edit
        Permission::create(['name' => 'store users']); // Store
        Permission::create(['name' => 'update users']); // Update
        Permission::create(['name' => 'delete users']); // Delete

        // Roles
        Permission::create(['name' => 'view roles']); // Index
        Permission::create(['name' => 'show roles']); // Show
        Permission::create(['name' => 'create roles']); // Create
        Permission::create(['name' => 'edit roles']); // Edit
        Permission::create(['name' => 'store roles']); // Store
        Permission::create(['name' => 'update roles']); // Update
        Permission::create(['name' => 'delete roles']); // Delete

        /**
         * Roles
         */

        // Admin
        $roleAdmin = Role::create(['name' => 'admin']);
        $roleAdmin->givePermissionTo(Permission::all());
        
        // Solver

        // User
    }
}
