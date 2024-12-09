import axios from "axios"
import React, { useEffect, useState } from "react"
import Header from "../comp/Header"
import { useNavigate, useParams } from "react-router-dom"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { FaDownload } from "react-icons/fa"
import { FaArrowCircleUp } from "react-icons/fa"

const SearchedBook = () => {
  const params = useParams()
  const bookQuery = params?.bookQuery
  const bookPage = params?.page

  const [stringVal, setStringVal] = useState("")
  const [bookData, setBookData] = useState(null)
  const [pushedSearch, setPushedSearch] = useState(false)
  const [nextBtn, setNext] = useState(null)
  const [prev, setPrev] = useState(null)
  const [postCount, setPostCOunt] = useState(null)

  useEffect(() => {
    if (!bookQuery || !bookPage) {
      return
    }
    setPushedSearch(true)

    const headers = {
      "x-apihub-key": "K1rKPUJ4N7xguMsHd6qCqyM7k5gJNo6ytuw6vTmwFQmt44YaM6",
      "x-apihub-host": "Ebook-Metadata-API.allthingsdev.co",
      "x-apihub-endpoint": "b6b8c575-3f0d-43cd-8924-26b2cf72e37d"
    }

    console.log("bookpage:", bookPage)

    axios
      .get(
        `https://Ebook-Metadata-API.proxy-production.allthingsdev.co/books/?search=${bookQuery}&page=${bookPage}`,
        { headers }
      )
      .then(response => {
        setBookData(response.data)
        setPushedSearch(false)
        setPostCOunt(response.data.count)

        setNext(response.data.next ? "response" : null)
        setPrev(response.data.previous ? "response" : null)

        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [params?.bookQuery, nextBtn, prev])

  const [bestSearch, setBestSearch] = useState([])

  useEffect(() => {
    if (bookData) {
      const filterBooks = bookData.results.filter(itm =>
        itm.title.toLowerCase().includes(bookQuery?.toLowerCase() || "")
      )
      if (filterBooks.length >= 10) {
        setBestSearch(filterBooks.slice(0, 10))
      }
    }
  }, [bookData, bookQuery])

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    AutoScroll({ startDelay: 0, stopOnInteraction: false, speed: 1 })
  ])

  const nav = useNavigate()

  function nextFunc() {
    if (params) {
      const addedPage = bookPage && parseInt(bookPage) + 1
      nav(`/search-book/${params?.bookQuery}/${addedPage}`)
      window.location.reload()
      window.scrollTo(0, 0)
    }
  }
  function prevFunc() {
    if (params) {
      if (bookPage && parseInt(bookPage) === 0) {
        return
      }
      const addedPage = bookPage && parseInt(bookPage) - 1
      nav(`/search-book/${params?.bookQuery}/${addedPage}`)
      window.location.reload()
      window.scrollTo(0, 0)
    }
  }

  const [slcVal, setSlcVal] = useState("")

  useEffect(() => {
    if (!bookQuery || (!bookPage && slcVal)) {
      return
    }
    setPushedSearch(true)

    const headers = {
      "x-apihub-key": "K1rKPUJ4N7xguMsHd6qCqyM7k5gJNo6ytuw6vTmwFQmt44YaM6",
      "x-apihub-host": "Ebook-Metadata-API.allthingsdev.co",
      "x-apihub-endpoint": "b6b8c575-3f0d-43cd-8924-26b2cf72e37d"
    }

    console.log("bookpage:", bookPage)

    axios
      .get(
        `https://Ebook-Metadata-API.proxy-production.allthingsdev.co/books/?search=${bookQuery}&page=${bookPage}&sort=${slcVal}`,
        { headers }
      )
      .then(response => {
        setBookData(response.data)
        setPushedSearch(false)
        setPostCOunt(response.data.count)

        setNext(response.data.next ? "response" : null)
        setPrev(response.data.previous ? "response" : null)

        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [slcVal])

  function visitByID(stringSearch) {
    console.log("Navigating to book:", stringSearch);
    const encodedBookQuery = encodeURIComponent(bookQuery);
    nav(`/searched-book/${stringSearch}?bookQuery=${encodedBookQuery}`);
  }
  

  return (
    <div className="w-full h-auto">
      <Header inputSee={false} bookSee={true} locString={"Book"} />
      <div className="w-full h-full">
        <div className="w-full max-w-[800px] font-semibold px-8 mb-1 border-b-[1px] border-b-[#e6e6e6]  py-3 mt-[80px] flex justify-between items-center gap-[80px] lg:justify-start md:max-w-[100%]">
          <div className="hidden md:block">Books</div>
          <div className="text-gray-400 text-[12px] text-left">
            {pushedSearch ? (
              <div>
                Searching results for{" "}
                {params?.bookQuery && params?.bookQuery.length > 20
                  ? params?.bookQuery?.slice(0, 20) + "..."
                  : params?.bookQuery}
              </div>
            ) : (
              <div>
                {!pushedSearch && postCount}
                {bookData?.results && bookData?.results.length > 1
                  ? "results"
                  : "result"}{" "}
                for "
                {params?.bookQuery && params?.bookQuery.length > 20
                  ? params?.bookQuery?.slice(0, 20) + "..."
                  : params?.bookQuery}
                "
              </div>
            )}
          </div>
          <div className="flex lg:hidden text-white rounded-md bg-[#e6e6e6]">
            <select
              className="outline-none "
              value={slcVal}
              onChange={e => {
                setSlcVal(e.target.value)
              }}
            >
              <option value="" className="text-white">Sort by</option>
              <option value="" className="">None</option>
              <option value="ascending">Most Popular</option>
              <option value="descending">Least Popular</option>
            </select>
          </div>
        </div>

        {pushedSearch ? (
          <div className="h-[100vh] w-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 44 44"
              stroke="#000"
            >
              <g fill="none" fill-rule="evenodd" stroke-width="2">
                <circle cx="22" cy="22" r="1">
                  <animate
                    attributeName="r"
                    begin="0s"
                    dur="1.8s"
                    values="1; 20"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.165, 0.84, 0.44, 1"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    begin="0s"
                    dur="1.8s"
                    values="1; 0"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.3, 0.61, 0.355, 1"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="22" cy="22" r="1">
                  <animate
                    attributeName="r"
                    begin="-0.9s"
                    dur="1.8s"
                    values="1; 20"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.165, 0.84, 0.44, 1"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    begin="-0.9s"
                    dur="1.8s"
                    values="1; 0"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.3, 0.61, 0.355, 1"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </svg>
          </div>
        ) : (
          <div className="flex px-5 flex-col lg:flex-row">
            <div className="pt-4 hidden lg:flex items-start ml-auto">
              <select
                className="outline-none bg-transparent font-bold "
                value={slcVal}
                onChange={e => {
                  setSlcVal(e.target.value)
                }}
              >
                <option value="" className="text-black">Sort by</option>
                <option value="" className="text-black">None</option>
                <option value="ascending" className="text-black">Most Popular</option>
                <option value="descending" className="text-black">Least Popular</option>
              </select>
            </div>
            <div className="flex flex-col h-full w-full classer">
              {bookData?.results.length === 0 ? (
                <div className="w-full h-full p-4">
                  <div className="font-bold m-3 text-[#292929] w-full h-[50vh]  max-w-[1200px] mx-auto mt-3  rounded-lg px-3 flex items-center justify-center bg-gray-300">
                    No results found!
                  </div>
                </div>
              ) : (
                <>
                  {bestSearch.length >= 10 && bookData?.results.length != 0 && (
                    <>
                      <div className="w-full  max-w-[1200px] mx-auto text-xl font-bold px-4 py-2">
                        For You
                      </div>
                      <div
                        className="embla z-0 relative less p-5"
                        ref={emblaRef}
                      >
                        <div className="embla__container">
                          {bestSearch.length != null &&
                            bestSearch.length >= 10 &&
                            bestSearch?.slice(0, 10).map(itm => (
                              <div
                                onClick={() => {
                                  visitByID(itm.id)
                                }}
                                className="embla__slide flex gap-3 justify-around bg-gray-300 text-black"
                                key={itm.id}
                              >
                                <div className="rounded-xl overflow-hidden h-[100%] w-auto font-bold book">
                                  <img
                                    src={itm.formats["image/jpeg"]}
                                    alt={`${itm.title} cover`}
                                    className="w-full h-full object-contain mb-2"
                                  />
                                </div>
                                <div className="h-[100%] flex flex-col justify-between">
                                  <div className="font-bold w-[200px] h-auto flex items-start justify-start text-black">
                                    {itm.title.length > 30
                                      ? itm.title.slice(0, 60) + "..."
                                      : itm.title}
                                  </div>
                                  <div className="flex flex-col text-white">
                                    <div className="text-black flex gap-1 justify-between">
                                      Downloads:
                                      <span className="gap-1 flex items-center justify-center bg-gray-700 text-white py-[1px] px-2 rounded-full">
                                        <span className="pb-[1px] text-[12px] flex items-center justify-center">
                                          <FaDownload />
                                        </span>
                                        {itm.download_count}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="w-full  max-w-[1200px] mx-auto text-xl font-bold px-4 py-2">
                    Browse
                  </div>
                  <div
                    className="w-full h-full
                                                    max-w-[1200px]
                                                  text-white p-2 grid grid-cols-2 
                                                    mx-auto
                                                    sm:grid-cols-2  
                                                    md:grid-cols-3 
                                                    lg:grid-cols-4 
                                                    xl:grid-cols-4 gap-5"
                  >
                    {bookData?.results.map(book => (
                      <div
                        onClick={() => {
                          visitByID(book.id)
                        }}
                        className="flex flex-col h-full m-h-[500px] p-4 items-center justify-center"
                        key={book.id}
                      >
                        <div className="w-[90%] h-full  rounded-lg overflow-hidden flex items-center justify-center book cursor-pointer">
                          {book.formats["image/jpeg"] && (
                            <img
                              src={book.formats["image/jpeg"]}
                              alt={`${book.title} cover`}
                              className="w-full h-full object-contain mb-2"
                            />
                          )}
                        </div>
                        <h2 className="text-[10px] mt-2 font-bold text-center w-full md:text-md lg:text-lg text-white">
                          {book.title.length > 30
                            ? book.title.slice(0, 30) + "..."
                            : book.title}
                        </h2>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 w-full  max-w-[1200px]  mx-auto py-4 px-5">
                    <div
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                      className="h-[30px] text-gray-700 text-3xl flex items-center justify-center hover:text-gray-950 cursor-pointer"
                    >
                      <FaArrowCircleUp />
                    </div>

                    {prev && (
                      <div className="flex gap-2">
                        <div
                          onClick={() => {
                            prevFunc()
                          }}
                          className="bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5  hover:bg-gray-950"
                        >
                          ({bookPage && parseFloat(bookPage) - 1}) prev page
                        </div>
                      </div>
                    )}
                    {nextBtn && (
                      <div
                        onClick={() => {
                          nextFunc()
                        }}
                        className="bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5 hover:bg-gray-950"
                      >
                        next page ({bookPage && parseFloat(bookPage) + 1})
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchedBook
