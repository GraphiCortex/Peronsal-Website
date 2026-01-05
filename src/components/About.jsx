  import React from "react";
  import Tilt from "react-parallax-tilt";
  import { motion } from "framer-motion";

  import { styles } from "../styles";
  import { services } from "../constants";
  import { SectionWrapper } from "../hoc";
  import { fadeIn, textVariant } from "../utils/motion";

  const ServiceCard = ({ index, title, description, icon }) => (
    <Tilt
      className="xs:w-[250px] w-full"
      tiltMaxAngleX={45}
      tiltMaxAngleY={45}
      scale={1}
      transitionSpeed={450}
    >
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />

          <h3 className="text-white text-[20px] font-bold text-center">
          {title}
          </h3>

          <p className="text-secondary text-[14px] text-center mt-2 leading-[18px]">
            {description}
          </p>
        </div>

      </motion.div>
    </Tilt>
  );

  const About = () => {
    return (
      <>
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Introduction</p>
          <h2 className={styles.sectionHeadText}>Overview.</h2>
        </motion.div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          I’m a student at the American University of Beirut, double majoring in Mathematics and Biology, while also minoring in Computational Science. Although most of my work is technical and involves building and testing models or analyses on biological and cognitive data, I also tend to spend time thinking about what this work actually shows, what remains unclear, and where its limits lie. This, alongside more in-depth exposure to other fields, has led me to pursue more seriously Mathematics, Philosophy, and Literature. This site collects some of that work and the thinking that accompanies it.        </motion.p>

        <div className='mt-20 flex flex-wrap gap-10'>
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>
      </>
    );
  };

  export default SectionWrapper(About, "about");