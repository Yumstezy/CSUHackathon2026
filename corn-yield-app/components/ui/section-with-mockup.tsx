"use client";
import React from "react";
import { motion } from "framer-motion";

interface SectionWithMockupProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  primaryImageSrc: string;
  secondaryImageSrc: string;
  reverseLayout?: boolean;
}

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
  title, description, primaryImageSrc, secondaryImageSrc, reverseLayout = false,
}) => {
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } } };
  const layoutClasses = reverseLayout ? "md:grid-cols-2 md:grid-flow-col-dense" : "md:grid-cols-2";
  const textOrder = reverseLayout ? "md:col-start-2" : "";
  const imgOrder  = reverseLayout ? "md:col-start-1" : "";

  return (
    <section className="relative py-16 bg-gray-950 overflow-hidden rounded-2xl">
      <div className="container max-w-[1220px] w-full px-6 md:px-10 relative z-10 mx-auto">
        <motion.div
          className={`grid grid-cols-1 gap-12 md:gap-8 w-full items-center ${layoutClasses}`}
          variants={container} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Text */}
          <motion.div
            className={`flex flex-col items-start gap-4 max-w-[546px] mx-auto md:mx-0 ${textOrder}`}
            variants={item}
          >
            <h2 className="text-white text-2xl md:text-[36px] font-bold leading-tight">{title}</h2>
            <p className="text-gray-400 text-sm md:text-base leading-7">{description}</p>
          </motion.div>

          {/* Images */}
          <motion.div
            className={`relative mx-auto ${imgOrder} w-full max-w-[300px] md:max-w-[460px]`}
            variants={item}
          >
            {/* Background card */}
            <motion.div
              className="absolute w-[280px] h-[300px] md:w-[440px] md:h-[470px] rounded-[28px] z-0 overflow-hidden"
              style={{
                top: reverseLayout ? "auto" : "10%",
                bottom: reverseLayout ? "10%" : "auto",
                left: reverseLayout ? "auto" : "-15%",
                right: reverseLayout ? "-15%" : "auto",
                filter: "blur(2px)",
              }}
              initial={{ y: 0 }}
              whileInView={{ y: reverseLayout ? -20 : -30 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="w-full h-full bg-cover bg-center rounded-[28px]"
                style={{ backgroundImage: `url(${secondaryImageSrc})` }} />
            </motion.div>

            {/* Main card */}
            <motion.div
              className="relative w-full h-[380px] md:h-[580px] bg-white/5 rounded-[28px] backdrop-blur-sm border border-white/10 z-10 overflow-hidden"
              initial={{ y: 0 }}
              whileInView={{ y: reverseLayout ? 20 : 30 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${primaryImageSrc})` }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {/* Bottom gradient line */}
      <div className="absolute w-full h-px bottom-0 left-0"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 100%)" }} />
    </section>
  );
};

export default SectionWithMockup;
