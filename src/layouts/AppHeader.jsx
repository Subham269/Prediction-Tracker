import { Button } from "@/components/ui/button";

function AppHeader()
{
    return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center font-bold text-lg">
        Prediction<span className="text-[#06A248]">OS</span>
        </div>
        
      <Button className="bg-[#06A248] hover:bg-[#058a3d] text-white">
        Sign In
      </Button>
    
    </header>
    );
}

export default AppHeader 
