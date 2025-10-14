import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { certifications } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const CertificationCard = ({ index, title, issuer, date, image }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >

        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain rounded-2xl bg-purple-500/10"
          />
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[20px]">{title}</h3>
          <p className="text-secondary text-[14px]">{issuer}</p>
          {date && <p className="text-secondary text-[12px] mt-1">{date}</p>}
        </div>

        <div className="mt-4">
          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:scale-105 transition-transform duration-300 inline-block"
          >
            View
          </a>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Certifications = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My Certificates</p>
        <h2 className={styles.sectionHeadText}>Certifications.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I hold relevant certifications that back up my IT support work. Below
        you can find proof of my CSS NC II certification.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-7 justify-center">
        {certifications.map((cert, index) => (
          <CertificationCard key={cert.id} index={index} {...cert} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Certifications, "certifications");
