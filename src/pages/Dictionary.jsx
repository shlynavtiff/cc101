import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlay } from "@fortawesome/free-solid-svg-icons";
import Header from "../comp/Header";
import Footer from "../comp/wasd/Footer";
import SaveResultFromCom from "../comp/SaveResultFromCom";

const Dictionary = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [word, setWord] = useState("hi");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false); // Modal visibility state
  const [resultToSave, setResultToSave] = useState(null); // Data to pass to the modal

  // Fetch data from API
  const fetchData = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`
      );
      if (!response.ok) throw new Error("Word not found!");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData(word);
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim()) fetchData(word);
  };

  // Play audio for pronunciation
  const handleAudioPlay = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.error("Error playing audio:", err));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-screen-lg w-full p-4">
          {/* Title and Profile */}
          <div className="flex justify-between mb-5">
            <h1 className="text-2xl font-bold">Dictionary</h1>
            <span className="text-xs">LeBron James</span>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative w-full px-5 mb-5">
            <input
              type="text"
              name="wordInput"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-8 top-[22px] transform -translate-y-1/2 text-gray-400"
            />
          </form>

          {/* Status Messages */}
          {isLoading && <p className="text-center mt-2">Loading...</p>}
          {error && <p className="text-center text-red-500 mt-2">Error: {error}</p>}

          {/* Word Data */}
          {data && data.length > 0 && (
            <div className="mt-5">
              {/* Word Details */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-semibold">{data[0].word}</h2>
                  {data[0].phonetics?.[0]?.text && (
                    <p className="text-purple-500">{data[0].phonetics[0].text}</p>
                  )}
                </div>
                {data[0].phonetics?.[0]?.audio && (
                  <button
                    className="bg-purple-400 w-12 h-12 flex justify-center items-center rounded-full"
                    onClick={() => handleAudioPlay(data[0].phonetics[0].audio)}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                )}
              </div>

              {/* Meanings */}
              {data[0].meanings.map((meaning, index) => (
                <div key={index} className="mt-10">
                  <h3 className="text-2xl capitalize">{meaning.partOfSpeech}</h3>
                  <p className="text-gray-500">Meaning</p>
                  <ul className="list-disc pl-5 mt-2">
                    {meaning.definitions.map((def, i) => (
                      <li key={i} className="mb-2">
                        {def.definition}
                        {def.example && (
                          <p className="text-sm italic">Example: {def.example}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={() => {
                  setResultToSave(data[0]); // Set the result to save
                  setIsSaveModalOpen(true); // Open the modal
                }}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Save Word
              </button>

              {/* Source */}
              {data[0].sourceUrls && (
                <div className="mt-20 text-xs">
                  <p>Source:</p>
                  <a
                    href={data[0].sourceUrls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {data[0].sourceUrls[0]}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Save Result Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SaveResultFromCom
            resultToSave={resultToSave}
            closer={setIsSaveModalOpen}
          />
        </div>
      )}
    </div>
  );
};

export default Dictionary;
