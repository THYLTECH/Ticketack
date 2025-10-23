import AppearanceToggleDropdown from "@/components/appearance-dropdown";

export function AuthHeader() {
    return (
        <header className="absolute top-0 left-0 p-4 flex items-center justify-end w-full ">
            <AppearanceToggleDropdown className=""/>
        </header>
    )
}