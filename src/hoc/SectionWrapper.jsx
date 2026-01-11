import { motion } from "framer-motion";

import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

/**
 * StarWrapper (SectionWrapper)
 * - Default: boxed layout (max-w-7xl + padding)
 * - Special case: "contact"/"bookportal" sections become FULL-BLEED (no side padding, no max width)
 *   so your BookPortal canvas can truly fill the viewport width.
 */
const StarWrapper = (Component, idName) =>
  function HOC() {
    const isFullBleed = idName === "contact" || idName === "bookportal";

    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={
          isFullBleed
            ? "relative z-0 w-screen max-w-none mx-0 px-0 py-0"
            : `${styles.padding} max-w-7xl mx-auto relative z-0`
        }
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>

        {/* Ensure children don't reintroduce horizontal overflow */}
        <div className={isFullBleed ? "w-full overflow-x-hidden" : ""}>
          <Component />
        </div>
      </motion.section>
    );
  };

export default StarWrapper;
