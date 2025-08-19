import { useState } from "react";
import { ExternalLink, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import whatsap from "../../assets/whatsap.jpg";
import { FaMicrophone } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import whatsappbg from "../../assets/whasappbg.png";
export default function TemplatePreview({ template, image, filetype }) {
  console.log("first", template);
  console.log("img", image);
    function truncate(str, maxLength) {
    if (typeof str !== "string") return "";
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
  }
  function parseCustomMarkdown(htmlString) {
    const raw = htmlString
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>") // *bold*
      .replace(/_(.*?)_/g, "<em>$1</em>") // _italic_
      .replace(/~(.*?)~/g, "<del>$1</del>"); // ~strikethrough~

    return DOMPurify.sanitize(raw); // Sanitize to prevent XSS
  }
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How are you doing today?",
      time: "10:21",
      sent: false,
      type: "received",
    },
    {
      id: 2,
      image: image,
      time: "10:45",
      sent: false,
      type: "received",
    },
    {
      id: 3,
      text: "Weekend sounds perfect! Saturday afternoon works for me",
      time: "11:08",
      sent: true,
      type: "sent",
    },
    {
      id: 4,
      text: "They have the best pastries and the atmosphere bg-[url('https://i.imgur.com/Vz8Iu7s.png')] is really cozy. We can spend hours there just talking and catching up on everything!",
      time: "11:21",
      sent: false,
      type: "received",
      isLong: true,
    },
  ]);

  return (
    <div className="flex justify-center mt-[150px] items-center max-h-[40vh]  p-4">
      {/* iPhone Frame */}
      <div className="relative">
        {/* Phone Shadow */}
        {/* <div className="absolute inset-0 bg-black rounded-[3rem] blur-xl opacity-50 scale-105"></div> */}

        {/* Phone Body */}
        <div
          className="relative h-full   !dark:bg-red-500 mt-[70px] md:mt-auto top-0 bg-gray-900 rounded-[3rem] p-2 shadow-2xl"
          style={{
            width: '335px',
            height:"650px",
            background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)'
          }}
        >
          {/* Screen */}
          <div className=" flex flex-col bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] dark:bg-[url('https://i.pinimg.com/564x/54/3d/e8/543de8a1f2887da54f7b7de6772f6aa2.jpg')] rounded-[2.5rem] overflow-hidden h-[100%]  relative">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10"></div>

            {/* Status Bar */}
            <div className="bg-[#075e54] px-6 pt-12 pb-2 flex justify-between items-center text-white text-sm font-medium">
              <div className="text-sm"></div>
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-white rounded-full opacity-60"></div>
                  <div className="w-1 h-3 bg-white rounded-full opacity-80"></div>
                  <div className="w-1 h-3 bg-white rounded-full"></div>
                  <div className="w-1 h-3 bg-white rounded-full"></div>
                </div>
                <div className="ml-1 text-xs">{49}%</div>
                <div className="w-6 h-3 border border-white rounded-sm ml-1">
                  <div className="w-full bg-green-400 rounded-sm"></div>
                </div>
              </div>
            </div>


            <div className="p-4 space-y-4 pb-20">

              <div
                className="flex border border-gray-100  bg-white/60  dark:bg-black/60  flex-col justify-center  items-start gap-3 py-2 border border-gray-700 rounded-md shadow-md bg-cover bg-center"
                // style={{ backgroundImage: `url(${whatsappbg})` }}
              >      <div className="p-2">
                  {template.components[0].format == "TEXT" ? (
                    <h1 className="text-xl  text-black dark:dark-text-primary font-semibold">
                      {template.components[0].text}
                    </h1>
                  ) : (
                    <>
                    {(!filetype?.startsWith("image") && !filetype?.startsWith("video") )&& (
                           <div className="w-full mx-auto">
                          <img
                          src={ whatsap}
                          alt="Shared image"
                          className="w-[200px] h-[200px]  rounded-xl"
                        />
                        </div>
                      )}

                      {filetype?.startsWith("image") && (
                        <div className="w-full mx-auto">
                          <img
                          src={image || whatsap}
                          alt="Shared image"
                          className="w-[200px] h-[200px]  rounded-xl"
                        />
                        </div>
                      )}

                      {filetype?.startsWith("video") && (
                        <video className="block mx-auto mt-3" width={300} controls>
                          <source src={image} type={filetype} />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </>
                  )}

                  <div className="flex mt-1 flex-col text-black dark:text-dark-text-primary ">

                    <div
                      className="w- text-wrap"
                      dangerouslySetInnerHTML={{
                        __html: parseCustomMarkdown(
                          truncate(template?.components[1]?.text,290) || "Body Texts"
                        ),
                      }}
                    ></div>

                  </div>
                </div>
                <div className="font-thin px-2 text-sm text-neutral-500">{template?.components[2]?.text || "Footer"}</div>

                <hr className="border border-border w-full" />

                <div className="flex flex-col gap-2">
                  <Link className="" to="#">
                    <button className="flex tracking-wide flex-row text-blue-400">
                      <ExternalLink size={20} className="mx-3" /> Send Msg
                    </button>
                  </Link>
                  <Link className="m" to="#">
                    <button className="flex tracking-wide flex-row text-blue-400">
                      {" "}
                      <PhoneCall size={20} className="mx-3" /> Call Now
                    </button>
                  </Link>
                </div>
                
              </div >
            
            </div>
        <div className="flex gap-3 items-center mx-auto mt-auto mb-1 w-full p-3 bottom-10">
         
                <input placeholder="Message" disabled className="px-3 pl-10 relative py-1 flex-1 rounded-full outline-none block  border border-black" type="text" />
                 <BsEmojiSmile className="absolute left-5" />
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-500">
<FaMicrophone />
                </div>
              </div>
          </div>
    
        </div>
      </div>
    </div>

  );
}