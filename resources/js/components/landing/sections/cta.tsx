// resources/js/components/landing/sections/cta.tsx

// Shadcn UI Components
import { Button } from "@/components/ui/button";

export default function Cta() {
    return (
        <div className="relative flex w-full flex-col justify-between md:flex-row">
			<div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-[99vw] border-t" />
			<div className="border-b py-4 md:border-b-0">
				<h2 className="text-center font-bold text-lg md:text-left md:text-2xl">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				</h2>
			</div>
			<div className="flex items-center justify-center gap-2 py-4 pl-8 md:border-l">
				<Button>Get Started</Button>
			</div>
			<div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-[99vw] border-b" />
		</div>
    )
}