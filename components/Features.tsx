import React from "react";
import { features } from "@/data/features";
import AcUnitIcon from "@mui/icons-material/AcUnit";

const Features = () => {
  return (
    <section
      id="features"
      className="w-full h-full flex flex-col gap-5 items-center py-10"
    >
      <span className="border-[#903AFF] border-2 mx-auto rounded-[50px] px-8 py-2 w-fit h-fit text-white">
        Features
      </span>
      <h1 className="text-[30px] xl:px-0 px-5 sm:text-[50px] md:text-[60px] lg:text-[80px] xl:text-[80px] mt-5 font-black text-white text-center lg:leading-[90px] xl:w-[1000px] mx-auto">
        Uncover the <span className="text-[#D434FE]">Exceptional</span> Features
        of Our Social Platform
      </h1>

      <ul className="mt-10 flex flex-wrap gap-5 w-[95%] mx-auto justify-center">
        {features.map((feature) => (
          <li
            key={feature.id}
            className="w-[420px] h-[250px] rounded-[10px] shadow-sm shadow-gray-600 bg-[rgb(11,11,41)] flex flex-col gap-5 items-center justify-center cursor-pointer hover:bg-[rgb(18,18,71)] hover:transition-ease hover:duration-200"
          >
            <AcUnitIcon className="text-[#D434FE]" fontSize="large" />
            <h3 className="text-white font-medium text-[20px]">
              {feature.title}
            </h3>
            <p className="text-gray-400 font-[200] text-[12px] text-center w-[80%]">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Features;
