<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Assets
            'view assets',
            'show assets',
            'create assets',
            'update assets',
            'delete assets',
            'restore assets',
            'force delete assets',
            // Users
            'view users',
            'show users',
            'create users',
            'update users',
            'delete users',
            // Roles
            'view roles',
            'show roles',
            'create roles',
            'update roles',
            'delete roles',
            // Tickets
            'view tickets',
            'show tickets',
            'create tickets',
            'be assigned tickets',
            'assign tickets',
            'update tickets',
            'delete tickets',
            'restore tickets',
            'force delete tickets',
            'archive tickets',
            'unarchive tickets',
            'view all archived tickets',
            'use ai suggestions tickets',
            // Ticket Relations
            'manage priority tickets',
            'manage status tickets',
            'manage category tickets',

            // Pointages
            'view ticket entries',
            'create ticket entries',
            'update ticket entries',
            'delete ticket entries',

            // Knowledge Explorer
            'view knowledge explorer',

            // Trash
            'view trash',
            'edit trash',
            'restore trash',
            'force delete trash',
            'manage trash settings',

            // Planning
            'view planning',
            'manage planning',

            //Dashboard
            'view dashboard',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Admin
        $roleAdmin = Role::firstOrCreate(['name' => 'admin']);
        $roleAdmin->syncPermissions(Permission::all());

        // Solveur
        $roleSolveur = Role::firstOrCreate(['name' => 'solver']);
        $roleSolveur->syncPermissions([
            'view tickets',
            'show tickets',
            'update tickets',
            'be assigned tickets',
            'create tickets',
            'archive tickets',
            'unarchive tickets',
            'view all archived tickets',
            'view planning',
            'manage planning',
            'view dashboard',
            'view ticket entries',
            'create ticket entries',
            'update ticket entries',
            'delete ticket entries',
            'view knowledge explorer',
            'use ai suggestions tickets'
        ]);

        // Simple User
        $roleUser = Role::firstOrCreate(['name' => 'simple_user']);
        $roleUser->syncPermissions([
            'view tickets',
            'show tickets',
            'create tickets'
        ]);
    }
}
