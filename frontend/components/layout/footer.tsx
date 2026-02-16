import { Camera } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Headshot</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Professional AI-powered headshots for everyone
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <div className="flex flex-col gap-2">
              <Link href="/features" className="text-muted-foreground hover:text-foreground text-sm">
                Features
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground text-sm">
                Pricing
              </Link>
              <Link href="/demo" className="text-muted-foreground hover:text-foreground text-sm">
                Demo
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm">
                Contact
              </Link>
              <Link href="/careers" className="text-muted-foreground hover:text-foreground text-sm">
                Careers
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Headshot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}