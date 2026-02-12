import { Target } from "lucide-react";
import Image from "next/image";
import DodgersSignupForm from "./ui/DodgersSignupForm";

const DodgersSection = () => {
  return (
    <div className="py-12 to-white dark:from-dark-200/20 dark:to-dark-100/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Panda Express Discount
            </h2>
          </div>
          <p className="text-base text-dark-200/80 dark:text-stone-200/80 max-w-3xl mx-auto leading-relaxed">
         Sign up to get an email alert whenever the Dodgers win a home game — so you don't miss your free Panda Express entrée the next day.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 dark:bg-dark-200/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-dark-200/10 dark:border-white/10">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            
            {/* Left Side*/}
            <div className="md:col-span-2 space-y-4">
              {/* Enhanced Header with Logos */}
              <div className="space-y-6">
                {/* Logo Row */}
                <div className="flex items-center justify-center gap-8">
                  {/* Dodgers Logo Placeholder */}
                  <div className="flex flex-col items-center gap-2">
                    <Image src="/imgs/logos/dodgers-logo.png" alt="LA Dodgers" width={80} height={80} />
                    <span className="text-xs text-dark-200/60 dark:text-stone-200/60">Dodgers</span>
                  </div>
                  
                  {/* Plus Icon */}
                  <div className="text-2xl text-dark-200/40 dark:text-stone-200/40 font-bold">+</div>
                  
                  {/* Panda Express Logo Placeholder */}
                  <div className="flex flex-col items-center gap-2">
                    <Image src="/imgs/logos/panda-express-logo.png" alt="Panda Express" width={80} height={80} />
                    <span className="text-xs text-dark-200/60 dark:text-stone-200/60">Panda Express</span>
                  </div>
                </div>
              </div>

                            {/* How It Works Steps */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-dark-200 dark:text-stone-200 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-primary rounded"></span>
                  How It Works
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-dark-200 dark:text-stone-200 mb-1">
                        Sign up with your email
                      </p>
                      <p className="text-xs text-dark-200/70 dark:text-stone-200/70">
                        Choose which days you want to receive notifications
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-dark-200 dark:text-stone-200 mb-1">
                        Get notified when Dodgers win at home
                      </p>
                      <p className="text-xs text-dark-200/70 dark:text-stone-200/70">
                        We'll check the game results every morning.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-dark-200 dark:text-stone-200 mb-1">
                        Receive email reminder for discount
                      </p>
                      <p className="text-xs text-dark-200/70 dark:text-stone-200/70">
                       When the Dodgers win at home, we'll send you an email reminder to claim your free entrée the next day.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Email Signup Form (3/5 width) */}
            <div className="md:col-span-3">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-dark-100 dark:to-dark-200 p-6 rounded-xl border border-primary/20 dark:border-primary/30 shadow-lg">
                <DodgersSignupForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DodgersSection;