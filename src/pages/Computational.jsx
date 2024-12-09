import React, { useState } from "react";
import Header from "../comp/Header";
import { CiSearch } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaGithub, FaFacebook, FaTiktok } from "react-icons/fa";
import LoadingSvg from "../comp/LoadingSvg";
import IsUser from "../comp/IsUser";
import SignInModal from "../comp/SignInModal";
import SaveResultFromCom from "../comp/SaveResultFromCom";
import Footer from "../comp/wasd/Footer";

const Computational = () => {
  const [user] = IsUser();
  const [stringVal, setStringVal] = useState("");
  const [dataRes, setDataRes] = useState(null);
  const [notParsed, setNotParsed] = useState(null);
  const [loading, setLoading] = useState(false);

  const errorModal = (textStag) => {
    toast.error(`${textStag}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const submitSearch = (e) => {
    e.preventDefault();

    if (stringVal.trim() === "") {
      return errorModal("Please type something...");
    }

    setLoading(true);

    const apiBase = "https://api.wolframalpha.com/v2/query";
    const appId = import.meta.env.VITE_CI_KEY; // Replace securely in production
    const query = encodeURIComponent(stringVal.trim());
    const url = `${apiBase}?appid=${appId}&input=${query}&output=XML`;

    console.log("Query URL:", url);

    // Use CORS Anywhere to bypass CORS restrictions
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";

    axios
      .get(proxyUrl + url)
      .then((res) => {
        console.log("Response Data:", res.data);

        if (res.status === 200 && res.data) {
          const xmlString = res.data;

          // Parse the XML
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, "application/xml");

          // Check for parsing errors
          const parseError = xmlDoc.querySelector("parsererror");
          if (parseError) {
            throw new Error("Failed to parse XML response");
          }

          setDataRes(xmlDoc);
          setNotParsed(xmlString);
        } else {
          throw new Error("Invalid response from Wolfram Alpha API");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
        errorModal("An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderXmlResult = () => {
    if (!dataRes) return null;

    const pods = dataRes.getElementsByTagName("pod");
    if (pods.length === 0) {
      return <div className="text-white">No results found!</div>;
    }

    return Array.from(pods).map((pod, index) => {
      const title = pod.getAttribute("title");
      const subpods = pod.getElementsByTagName("subpod");

      return (
        <div key={index} className="pod border-t-gray-600 border-t-[1px] my-4">
          <h2 className="font-semibold text-white p-3 bg-gray-700 rounded-lg">
            {title || "Untitled"}
          </h2>
          {Array.from(subpods).map((subpod, subIndex) => {
            const img = subpod.querySelector("img");
            const plaintext = subpod.querySelector("plaintext");

            return (
              <div key={subIndex} className="subpod bg-gray-400 rounded-lg p-3">
                {img && <img src={img.getAttribute("src")} alt="Result" />}
                {plaintext && <p>{plaintext.textContent}</p>}
              </div>
            );
          })}
        </div>
      );
    });
  };

  const [showSaveModal, setSaveModal] = useState(false);

  return (
    <div className="flex flex-col justify-between p-3">
      <ToastContainer />
      {showSaveModal && (
        <>
          {user ? (
            <div
              onClick={() => {
                setSaveModal(false);
              }}
              className="custom-pos h-[100dvh] z-[200000000] items-center flex justify-center"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-full h-auto max-w-[400px]"
              >
                <SaveResultFromCom
                  resultToSave={notParsed}
                  closer={setSaveModal}
                />
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                setSaveModal(false);
              }}
              className="custom-pos h-[100dvh] z-[200000000] items-center flex justify-center"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-full max-w-[400px] h-auto"
              >
                <SignInModal isDataSave={true} />
              </div>
            </div>
          )}
        </>
      )}
      <Header bookSee={false} inputSee={false} locString="Computation" />

      <div className="h-full min-h-[50vh] mt-[80px] flex items-center justify-center flex-col gap-1 p-3">
        <form
          onSubmit={submitSearch}
          className="w-full max-w-[700px]"
          action="submit"
        >
          <h1 className="text-[2rem] font-bold text-center lg:text-[2.5rem] text-white">
            COMPUTATIONAL INTELLIGENCE
          </h1>
          <h3 className="text-md font-medium text-center text-white">
          Leverage AI-powered computational results at your fingertips.
          </h3>
          <div className="relative w-full mt-2">
            <div className="positioner">
              <CiSearch />
            </div>
            <input
              value={stringVal}
              onChange={(e) => {
                setStringVal(e.target.value);
              }}
              className="w-full h-[50px] border-2 px-2 outline-none rounded-3xl bg-[#f9f9f9] pl-8 relative z-0 text-black"
              type="text"
              placeholder="Ask something..."
            />
          </div>
        </form>
      </div>
      {dataRes != null ? (
        <div className="w-full max-w-[700px] min-h-[36vh] mx-auto mb-auto">
          {loading ? (
            <div className="w-full h-[36vh] flex items-center justify-center bg-gray-200 rounded-lg mb-3">
              <div className="flex flex-col gap-1 items-start justify-start">
                <div className="mx-auto">
                  <LoadingSvg />
                </div>
                <p className="text-[13px] text-gray-600">
                  Finding result based on your question
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-end justify-end my-2">
                <button
                  onClick={() => {
                    setSaveModal(true);
                  }}
                  className="bg-green-500 text-white rounded-lg py-1 px-3"
                >
                  Save
                </button>
              </div>
              <div className="p-3 w-full h-auto bg-[#292929] rounded-lg overflow-hidden">
                {renderXmlResult()}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="w-full h-auto grid grid-cols-2 gap-3 px-5 py-3 md:flex mb-3">
            <div className="w-full h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col min-h-[300px]">
              <div className="font-bold text-xl mb-3 md:text-2xl break-all">
                Header one
              </div>
              <p className="text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam,
                quae eius adipisci dolorum, obcaecati rem earum eaque, sequi
                assumenda cumque officia. Consectetur excepturi aliquam modi
                culpa rem aliquid at ea!
              </p>
              <div className="mt-auto">
                <button onClick={() => {
                alert("Page is under development")
              }} className="mt-3 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold">
                  Learn More
                </button>
              </div>
            </div>
            <div className="w-full h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col min-h-[300px]">
              <div className="font-bold text-xl mb-3 md:text-2xl break-all">
                Header two
              </div>
              <p className="text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam,
                quae eius adipisci dolorum, obcaecati rem earum eaque, sequi
                assumenda cumque officia. Consectetur excepturi aliquam modi
                culpa rem aliquid at ea!
              </p>

              <div className="mt-auto">
                <button onClick={() => {
                alert("Page is under development")
              }} className="mt-3 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold">
                  Learn More
                </button>
              </div>
            </div>
            <div
              id="legnthen"
              className="col-span-2 w-[100%] h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col min-h-[300px]"
            >
              <div className="font-bold text-xl mb-3 md:text-2xl break-all">
                Header three
              </div>
              <p className="text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam,
                quae eius adipisci dolorum, obcaecati rem earum eaque, sequi
                assumenda cumque officia. Consectetur excepturi aliquam modi
                culpa rem aliquid at ea!
              </p>

              <div className="mt-auto">
                <button onClick={() => {
                alert("Page is under development")
              }} className="mt-3 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col items-center justify-center gap-1 mb-3 mt-3">
            <div className="text-[#292929]">Support the Developer</div>
            <div className="flex gap-3">
              <div
                onClick={() => {
                  window.open("https://github.com/marcusxro", "_blank");
                }}
                className="cursor-pointer text-[#292929]"
              >
                <FaGithub />
              </div>
              <div
                onClick={() => {
                  window.open("https://www.facebook.com/marcuss09", "_blank");
                }}
                className="cursor-pointer text-[#292929]"
              >
                <FaFacebook />
              </div>
              <div
                onClick={() => {
                  window.open("https://www.tiktok.com/@marcuxro", "_blank");
                }}
                className="cursor-pointer text-[#292929]"
              >
                <FaTiktok />
              </div>
            </div>
          </div> */}
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default Computational;