<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Assets
            'view assets', 'show assets', 'create assets', 'update assets', 'delete assets', 'restore assets', 'force delete assets',
            // Users
            'view users', 'show users', 'create users', 'update users', 'delete users',
            // Roles
            'view roles', 'show roles', 'create roles', 'update roles', 'delete roles',
            // Tickets
            'view tickets', 'show tickets', 'create tickets', 'update tickets', 'delete tickets', 'restore tickets', 'force delete tickets',
            // Trash
            'view trash', 'edit trash', 'restore items', 'force delete items',
            // Planning
            'view planning', 'manage planning'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Rôle Admin : Toutes les permissions
        $roleAdmin = Role::firstOrCreate(['name' => 'admin']);
        $roleAdmin->syncPermissions(Permission::all());

        // Rôle Solveur : Accès aux tickets et au planning (RG023)
        $roleSolveur = Role::firstOrCreate(['name' => 'solver']);
        $roleSolveur->syncPermissions([
            'view tickets',
            'show tickets',
            'update tickets',
            'view planning',
            'manage planning'
        ]);

        // Rôle Utilisateur : Création et consultation de ses tickets
        $roleUser = Role::firstOrCreate(['name' => 'utilisateur']);
        $roleUser->syncPermissions([
            'view tickets',
            'show tickets',
            'create tickets'
        ]);
    }
}
