import { useState } from "react";
import { TbAlertCircle } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import { ToastContainer } from "react-toastify";
import { getAnimatedCursor } from "./animation/AnimatedCursor";
import LivelinessCheck from "./components/liveliness-check";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [livelinessNote, setLivelinessNote] = useState(false);
  const [showLivelinessCheck, setShowLivelinessCheck] = useState(false);
  const [completedLiveliness, setCompletedLiveliness] = useState(false);

  const startLivelinessCheck = (completedLiveliness) =>
    !completedLiveliness && setShowLivelinessCheck(true);

  return (
    <>
      {getAnimatedCursor()}
      <div className="flex items-center justify-center h-screen">
        {showLivelinessCheck ? (
          <LivelinessCheck
            completedLiveliness={completedLiveliness}
            setShowLivelinessCheck={setShowLivelinessCheck}
            setCompletedLiveliness={setCompletedLiveliness}
          />
        ) : (
          <div>
            <div
              className={`w-[410px] h-[300px] p-10 flex items-center justify-center rounded-[20px] border-2 bounce-in-top ${
                completedLiveliness ? "border-[#18CF21]" : "border-[#FF3B30]"
              }`}
            >
              <div className="relative w-full flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] text-[#002564] font-[600]">
                    Liveliness check
                  </p>
                  <TbAlertCircle
                    className="text-[18px] text-[#002564] cursor-pointer animated_cursor"
                    onClick={() => setLivelinessNote(!livelinessNote)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <p
                    className={`text-[13px] text-[#1E1E1E] font-[600] underline underline-offset-4 cursor-pointer hover:text-[#002564] hover:font-[600] transition-all duration-300 ease-in-out ${
                      !completedLiveliness && "animated_cursor"
                    }`}
                    onClick={() => startLivelinessCheck(completedLiveliness)}
                  >
                    {completedLiveliness ? "Completed" : "Click here to start"}
                  </p>
                  <GoDotFill
                    className={`text-[25px] ${
                      completedLiveliness ? "text-[#18CF21]" : "text-[#FF3B30]"
                    }`}
                  />
                </div>

                {livelinessNote && (
                  <div className="absolute top-[50px] left-0 w-full md:w-[330px] h-[100vh] md:h-[62px] bg-white flex justify-center items-center p-4 leading-[20px] tracking-normal z-[800] swing-in-top-fwd drop-shadow-2xl">
                    <p className="text-[#002564] text-[12px]">
                      <strong>Note:</strong> Please ensure you are in a well lit
                      environment before you begin the Liveliness check
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-center text-[#002564] text-[12px] mt-5">
              Made with ❤️ by
              <a
                href="https://github.com/DhanteyUD"
                target="_blank"
                className="hover:text-[#FF3B30] transition-all duration-300 ease-in-out"
              >
                <strong> @DhanteyUD</strong>
              </a>
            </p>
          </div>
        )}
      </div>

      <ToastContainer />
    </>
  );
}

export default App;
