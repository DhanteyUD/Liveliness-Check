const WhiteSpinner = () => {
  return (
    <div className="flex justify-center">
      <div className="w-6 aspect-square border-4 border-transparent border-r-white dark:border-r-black rounded-full relative animate-spin">
        <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-r-white dark:border-r-black animate-[spin_2s_linear_infinite]"></div>
        <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-r-white dark:border-r-black animate-[spin_4s_linear_infinite]"></div>
      </div>
    </div>
  );
};

export default WhiteSpinner;
