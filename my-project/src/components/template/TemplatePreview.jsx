import { useState } from "react";
import { ExternalLink, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import whatsap from "../../assets/whatsap.jpg";
import whatsappbg from "../../assets/whasappbg.png";
export default function TemplatePreview({ template, image }) {
  console.log("first", template);
  console.log("img", image);
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
<div
    className="flex flex-col justify-center  items-start gap-3 py-2 border border-gray-700 rounded-md shadow-md bg-cover bg-center"
    style={{ backgroundImage: `url(${whatsappbg})` }}
  >      <div className="p-2">
        {template.components[0].format == "TEXT" ? (
          <h1 className="text-xl  text-black font-semibold">
            {template.components[0].text}
          </h1>
        ) : (
          <img
            src={image || whatsap}
            alt="Shared image"
            className="w-full h- object-cover rounded-xl"
          />
        )}

        <div className="flex mt-1 flex-col text-black ">
          
            <div
              className="w- text-wrap"
              dangerouslySetInnerHTML={{
                __html: parseCustomMarkdown(
                  template?.components[1]?.text || "Body Texts"
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
    </div>
  );
}