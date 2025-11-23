"use client";

import { motion } from "framer-motion";
import { Search, FileText, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Browse & Select",
    description: "Explore our extensive catalog of certified medical equipment.",
    icon: Search,
  },
  {
    number: "02",
    title: "Request Quote",
    description: "Submit your requirements and get a custom proposal within 24h.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Secure Delivery",
    description: "We handle logistics, installation, and initial calibration.",
    icon: Truck,
  },
  {
    number: "04",
    title: "Training & Support",
    description: "Receive staff training and ongoing technical support.",
    icon: CheckCircle,
  },
];

export function ProcessSteps() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C2C46] mb-4">
              Streamlined Procurement Process
            </h2>
            <p className="text-slate-600 text-lg">
              We make acquiring medical equipment simple, transparent, and efficient for healthcare providers.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative bg-white lg:bg-transparent p-6 lg:p-0 rounded-xl border lg:border-none border-border/50"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-24 w-24 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center mb-6 relative z-10 shadow-sm">
                      <step.icon className="h-10 w-10 text-accent" />
                      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-[#0C2C46] text-white flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#0C2C46] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
