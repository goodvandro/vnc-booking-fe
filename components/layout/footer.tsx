import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

interface FooterProps {
  t: any
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.companyName || "Modern Booking"}</h3>
            <p className="text-sm text-muted-foreground">
              {t.companyDescription ||
                "Your trusted partner for guest house bookings and car rentals. Experience comfort and convenience with our premium services."}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.quickLinks || "Quick Links"}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#guest-houses" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.guestHouses || "Guest Houses"}
                </Link>
              </li>
              <li>
                <Link href="#car-rental" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.carRental || "Car Rental"}
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.aboutUs || "About Us"}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.contact || "Contact"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.services || "Services"}</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">{t.luxuryAccommodation || "Luxury Accommodation"}</li>
              <li className="text-muted-foreground">{t.carRentalService || "Car Rental Service"}</li>
              <li className="text-muted-foreground">{t.customerSupport || "24/7 Customer Support"}</li>
              <li className="text-muted-foreground">{t.flexibleBooking || "Flexible Booking"}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.contactInfo || "Contact Info"}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t.address || "123 Business Street, City, Country"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t.phoneNumber || "+1 (555) 123-4567"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t.emailAddress || "info@modernbooking.com"}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 {t.companyName || "Modern Booking"}. {t.allRightsReserved || "All rights reserved."}
          </p>
          <div className="flex space-x-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              {t.privacyPolicy || "Privacy Policy"}
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              {t.termsOfService || "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
