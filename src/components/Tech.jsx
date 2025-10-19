import React, { useEffect, useState } from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { BallCanvas } from "./canvas";
import { useInView } from "react-intersection-observer";

const Tech = () => {
  const [isMobile, setIsMobile] = useState(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  const content = (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.map((technology) => (
        <div className='w-28 h-28' key={technology.name}>
          <BallCanvas icon={technology.icon} />
        </div>
      ))}
    </div>
  );

  return (
    <div ref={isMobile ? ref : null}>
      {isMobile ? (
        inView ? (
          content
        ) : (
          <div className='w-full h-[300px] flex justify-center items-center animate-pulse bg-neutral-800 rounded-xl'>
            <p className='text-gray-400 text-sm'>Loading 3D...</p>
          </div>
        )
      ) : (
        content
      )}
    </div>
  );
};

export default SectionWrapper(Tech, "");
