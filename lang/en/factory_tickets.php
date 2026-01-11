<?php

return [
    'scenarios' => [
        'server' => [
            ['title' => 'High CPU usage on production', 'description' => 'The main web server is showing 90% CPU usage for over an hour. Needs investigation.'],
            ['title' => 'SSL certificate expiring', 'description' => 'The SSL certificate for the internal API will expire in 3 days. Please renew.'],
            ['title' => 'Disk space running low', 'description' => 'Partition /var/log is 95% full. Old logs might need rotation or deletion.'],
        ],
        'laptop' => [
            ['title' => 'Broken screen', 'description' => 'The user dropped the laptop and the screen is flickering or totally black.'],
            ['title' => 'Keyboard spill', 'description' => 'Coffee was spilled on the keyboard. Some keys are non-responsive.'],
            ['title' => 'Battery not charging', 'description' => 'The device only works when plugged in. Battery status stays at 0%.'],
        ],
        'router' => [
            ['title' => 'Wi-Fi signal dropping', 'description' => 'Users in the South wing report frequent disconnections from the office Wi-Fi.'],
            ['title' => 'VPN access down', 'description' => 'The tunnel for remote workers is not establishing. Error 403 on connection.'],
        ],
        'wrench' => [
            ['title' => 'Broken printer', 'description' => 'The printer is not printing.'],
            ['title' => 'Printer needs refilled', 'description' => 'The printer is out of ink.'],
            ['title' => 'Printer needs replaced', 'description' => 'The printer is no longer functional.'],
        ],
        'cube' => [
            ['title' => 'Virtual module lagging', 'description' => 'The virtual module is experiencing high latency.'],
            ['title' => 'Virtual module not booting', 'description' => 'The virtual module is not booting.'],
            ['title' => 'Virtual module not responding', 'description' => 'The virtual module is not responding.'],
        ],
        'box' => [
            ['title' => 'Network box overheating', 'description' => 'The network box is overheating and causing intermittent connectivity issues.'],
            ['title' => 'Network box firmware update', 'description' => 'A critical firmware update is available for the network box.'],
            ['title' => 'Network box power failure', 'description' => 'The network box has lost power and needs to be restarted.'],
        ],
    ],
    'generic' => [
        ['title' => 'General maintenance request', 'description' => 'Standard checkup required for this asset to ensure optimal performance.'],
        ['title' => 'Software installation needed', 'description' => 'Request to install necessary software on the asset.'],
        ['title' => 'Performance issues reported', 'description' => 'User reports that the asset is running slower than usual.'],
    ]
];